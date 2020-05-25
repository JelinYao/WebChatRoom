

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
    {id:1, name:"JavaScript学习交流", desc:"JavaScript是世界上最好的语言", limit:5},
    {id:2, name:"历史学习交流", desc:"爱历史，爱学习,不思量，自难相忘。物是人非事事休", limit:5},
    {id:3, name:"C/C++学习交流", desc:"C/C++是世界上最好的语言", limit:5},
    {id:4, name:"Java学习交流", desc:"Java是世界上最好的语言", limit:5},
    {id:5, name:"python学习交流", desc:"python是世界上最好的语言", limit:5},
    {id:6, name:"c#学习交流", desc:"c#是世界上最好的语言", limit:5},
]

module.exports = {
    enum : {BoardcastType, MessageType},
    define : {avataCount, currentUserId},
    data : {roomList, },
}