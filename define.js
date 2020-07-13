

//定义消息类型
var BoardcastType = {
    BtEnterRoom : 0,
    BtExitRoom : 1,
    BtMessage : 2,
    BtUserList : 3,
    BtUserFull : 4,
}

//定义聊天消息类型
var MessageType = {
    MtText : 0,
    MtImage : 1,
    MtEmoji : 2,
}

//用户头像数目
const avataCount = 40;
//用户ID，自增长
var currentUserId = 10000;

//定义列表
var roomList = [
    {id:1, name:"JavaScript学习交流", desc:"JavaScript是世界上最好的语言", limit:5, ico:"img/room/js.jpg"},
    {id:2, name:"历史学习交流", desc:"昨夜雨疏风骤，浓睡不消残酒，试问卷帘人，却道海棠依旧。知否、知否，应是绿肥红瘦。", limit:5, ico:"img/room/liqingzhao.jpg"},
    {id:3, name:"C/C++学习交流", desc:"C/C++是世界上最好的语言", limit:5, ico:"img/room/cpp.jpg"},
    {id:4, name:"Java学习交流", desc:"Java是世界上最好的语言", limit:5, ico:"img/room/java.jpg"},
    {id:5, name:"python学习交流", desc:"python是世界上最好的语言", limit:5, ico:"img/room/python.jpg"},
    {id:6, name:"c#学习交流", desc:"c#是世界上最好的语言", limit:5, ico:"img/room/csharp.jpg"},
]

//定义自动回复消息
var autoChatMessage = {
    what: [
        '你在说啥呀？', '听不懂，你在说啥？', '我太南了，你在说啥呀', '我真的听不懂你说的话，555555', '听不懂，我就静静地看着你说', '休息一下吧亲'
    ],
}

module.exports = {
    enum : {BoardcastType, MessageType, },
    define : {avataCount, currentUserId},
    data : {roomList, autoChatMessage},
}
