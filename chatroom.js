var defineModule = require('./define');
var BoardcastType = defineModule.enum.BoardcastType;
var listModule = require('./list');
var List = listModule.list;


class chatroom{
    constructor(io, _namespace, _userLimit){
        this.userLimit = _userLimit
        this.namespace = _namespace;
        this.clientList = new List();
        this.socketio = io.of('/' + this.namespace);
        console.log("创建房间：", this.namespace);
        this.socketio.on('connection', socket=>{
            //客户端注册
            socket.on('register', data=>{
                if(this.clientList.size()>=this.maxClientCount){
                    var msg = {type:BoardcastType.BtUserFull};
                    socket.emit('chat', msg);
                    //关闭连接
                    socket.disconnect(true);
                    return;
                }
                var msg = {};
                var user = {};
                user.id = this.getUserID();
                user.name = user.id;
                user.avata = this.getUserAvata();
                user.socketId = socket.id;
                user.uuid = data.uuid;
                var userList = this.clientList.getArray();
                this.clientList.add(user);
                //客户端上线，通知所有其他客户端
                msg.type = BoardcastType.BtEnterRoom;
                msg.user = user;
                msg.time = new Date().getTime();
                this.socketio.emit('chat', msg);
                //向当前客户端发送在线列表
                if(userList.length > 0 ){
                    msg.type = BoardcastType.BtUserList;
                    msg.user = userList;
                    msg.time = new Date().getTime();
                    socket.emit('chat', msg);
                }
            });

            //客户端发送聊天消息，广播到其他客户端
            socket.on('chat', data=>{
                //带上服务器时间
                data.time = new Date().getTime();
                /**
                 * Sets the 'broadcast' flag when emitting an event. Broadcasting an event
                 * will send it to all the other sockets in the namespace except for yourself
                 * 广播到当前域空间下除了自己的所有连接的socket
                 */
                socket.broadcast.emit('chat', data);
            });

            //客户端下线
            socket.on('disconnect', data=>{
                //广播到当前域空间下所有连接的socket
                var user = this.clientList.findByKey(this.socketIdCpmpare, socket.id);
                if(user === null){
                    console.log("客户端下线，没有找到对应的节点");
                    return;
                }
                this.clientList.remove(user);
                //客户端上线，通知所有其他客户端
                var msg = {};
                msg.type = BoardcastType.BtExitRoom;
                msg.user = user;
                msg.time = new Date().getTime();
                this.socketio.emit('chat', msg);
            });
        });
    }

    //随机生成用户头像
    getUserAvata(){
        var index = (Math.round(Math.random()*1000))%defineModule.define.avataCount + 1;
        return "img/avata/" + index + ".png";
    }
    //生成用户ID
    getUserID(){
        return defineModule.define.currentUserId++; 
    }

    socketIdCpmpare(user, socketId){
        return user.socketId === socketId;
    }
}

module.exports = {
    chatroom : chatroom,
}