var defineModule = require('./define');
var BoardcastType = defineModule.enum.BoardcastType;
var MessageType = defineModule.enum.MessageType;
var autoChatMessage = defineModule.data.autoChatMessage;
var listModule = require('./list');
var List = listModule.list;

var logModule = require('./log');
const { text } = require('express');
const logger = logModule.getLogger();
const errorLogger = logModule.getLogger('err');


class chatroom{
    constructor(io, _namespace, _userLimit, _name){
        this.userLimit = _userLimit
        this.namespace = _namespace;
        this.name = _name;
        this.clientList = new List();
        this.initRobot();
        this.socketio = io.of('/' + this.namespace);
        logger.info("创建房间%s ID：%s", this.name, this.namespace);
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
                //客户端IP地址
                var client_ip = null;
                if(socket.handshake.headers['x-forwarded-for'] != null){
                    client_ip = socket.handshake.headers['x-forwarded-for'];
                }else{
                    client_ip = socket.handshake.address;
                }
                logger.info("客户端IP：%s", client_ip);
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
                logger.info("房间：%s, 客户端上线：%s，当前在线人数：%d", this.name, JSON.stringify(user), this.clientList.size());
                //向当前客户端发送在线列表
                if(userList.length > 0 ){
                    msg.type = BoardcastType.BtUserList;
                    msg.user = userList;
                    msg.time = new Date().getTime();
                    socket.emit('chat', msg);
                }
                this.sendRobotMsg(socket, '欢迎' + user.name +'进入' + this.name + '聊天室');
            });

            //客户端发送聊天消息，广播到其他客户端
            socket.on('chat', msg=>{
                //带上服务器时间
                msg.time = new Date().getTime();
                /**
                 * Sets the 'broadcast' flag when emitting an event. Broadcasting an event
                 * will send it to all the other sockets in the namespace except for yourself
                 * 广播到当前域空间下除了自己的所有连接的socket
                 */
                socket.broadcast.emit('chat', msg);
                logger.info("客户端发送消息：%s", JSON.stringify(msg));
                var reply = false;
                if (msg.data.type !== undefined && msg.data.type === MessageType.MtText) {
                    reply = this.autoReply(socket, msg.data.value);
                }
                if (this.clientList.size() === 2 && !reply) {
                    const size = autoChatMessage.what.length;
                    const index = parseInt(Math.random()*(size-1), 10); 
                    this.sendRobotMsg(socket, autoChatMessage.what[index]);
                }
            });

            //客户端下线
            socket.on('disconnect', data=>{
                //广播到当前域空间下所有连接的socket
                var user = this.clientList.findByKey(this.socketIdCpmpare, socket.id);
                if(user === null){
                    logger.info("客户端下线，没有找到对应的节点");
                    return;
                }
                this.clientList.remove(user);
                //客户端上线，通知所有其他客户端
                var msg = {};
                msg.type = BoardcastType.BtExitRoom;
                msg.user = user;
                msg.time = new Date().getTime();
                this.socketio.emit('chat', msg);
                logger.info("客户端下线：%s，当前在线人数：%d", JSON.stringify(user), this.clientList.size());
            });
        });
    }

    //随机生成用户头像
    getUserAvata() {
        var index = (Math.round(Math.random()*1000))%defineModule.define.avataCount + 1;
        return "img/avata/" + index + ".png";
    }
    //生成用户ID
    getUserID() {
        return defineModule.define.currentUserId++; 
    }

    socketIdCpmpare(user, socketId){
        return user.socketId === socketId;
    }
    //初始化聊天机器人
    initRobot() {
        this.robot = {};
        //初始化机器人
        this.robot.id = this.getUserID();
        this.robot.name = '青青';
        this.robot.avata = 'img/avata/robot.jpg';
        this.robot.socketId = 0;
        this.robot.uuid = '00000000000000000000000000';
        this.clientList.add(this.robot);
    }
    //机器人发送消息
    sendRobotMsg(socket, text) {
        var msg = {data:{}};
        msg.type = BoardcastType.BtMessage;
        msg.user = this.robot;
        msg.time = new Date().getTime();
        msg.data.type = MessageType.MtText;
        msg.data.value = text;
        socket.emit('chat', msg);
    } 
    //机器人自动回复
    autoReply(socket, text) {
        if (text.indexOf('你是谁') !== -1) {
            this.sendRobotMsg(socket, '你好呀，我是青青');
            return true;
        }
        if (text.indexOf('有人吗') !== -1 || text.indexOf('人呢') !== -1) {
            this.sendRobotMsg(socket, '在呢');
            return true;
        }
        if (text.indexOf('性别') !== -1 || text.indexOf('男女') !== -1) {
            this.sendRobotMsg(socket, '我是机器人，没有性别');
            return true;
        }
        if (text.indexOf('机器人') !== -1) {
            this.sendRobotMsg(socket, '干嘛，我很忙的');
            return true;
        }
        return false;
    }
}

module.exports = {
    chatroom : chatroom,
}