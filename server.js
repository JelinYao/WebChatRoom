/*****************************
 * Node.js学习代码
 * 测试socket.io聊天室
 * socket.io官网：https://socket.io/
 * github: https://github.com/JelinYao/Node.jsStudy

 */
//定义消息类型
var BoardcastType = {
    BtEnterRoom : 0,
    BtExitRoom : 1,
    BtMessage : 2
}

//定义聊天消息类型
var MessageType = {
    MtText : 0,
    MtImage : 1,
    MtEmoji : 2
}

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
let path = require('path');
var listModule = require('./list');
var List = listModule.list;

var clientList = new List();

//设置本地静态资源路径
app.use(express.static(path.join(__dirname, './client')));
//监听本地端口
server.listen(80);

//返回主页地址
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/client/index.html');
})

//SocketIO.Socket
io.on('connection', socket=>{
    //客户端注册
    socket.on('register', data=>{
        var person = {};
        person.id = getUserID();
        person.name = person.id;
        person.avata = getUserAvata();
        person.socketId = socket.id;
        person.uuid = data.uuid;
        clientList.add(person);
        //客户端上线，通知所有其他客户端
        var msg = {};
        msg.type = BoardcastType.BtEnterRoom;
        msg.person = person;
        msg.time = new Date().getTime();
        io.emit('chat', msg);
    });

    //客户端发送聊天消息，广播到其他客户端
    socket.on('chat', data=>{
        //带上服务器时间
        data.time = new Date().getTime();
        broadcastMsg(socket, data);
    });

    //客户端下线
    socket.on('disconnect', data=>{
        //广播到当前域空间下所有连接的socket
        var person = null;
        for(var p in clientList){
            if(socket.id === p.socketId){
                person = p;
            }
        }
        if(person === null){
            console.log("客户端下线，没有找到对应的节点");
            return;
        }
        //客户端上线，通知所有其他客户端
        var msg = {};
        msg.type = BoardcastType.BtExitRoom;
        msg.person = person;
        msg.time = new Date().getTime();
        io.emit('chat', msg);
    });
});

function broadcastMsg(socket, data){
    /**
     * Sets the 'broadcast' flag when emitting an event. Broadcasting an event
     * will send it to all the other sockets in the namespace except for yourself
     * 广播到当前域空间下除了自己的所有连接的socket
     */
    socket.broadcast.emit('chat', data);
}

const avata_count = 21;

function getUserAvata(){
    var index = (Math.round(Math.random()*1000))%avata_count + 1;
    return "img/avata/" + index + ".png";
}

var currentUserId = 10000;
function getUserID(){
    return currentUserId++; 
}