//服务器域名地址
const SERVER_URL = "https://localhost";

//定义消息类型
const BoardcastType = {
    BtEnterRoom : 0,
    BtExitRoom : 1,
    BtMessage : 2,
    BtUserList : 3,
    BtUserFull : 4,
}

//定义聊天消息类型
const MessageType = {
    MtText : 0,
    MtImage : 1,
    MtEmoji : 2,
}

//定义聊天图片最大大小
const MaxImgSize = 2*1024*1024;//2M

//定义聊天表情
const ImgPath = "img/emoji/";
const EnojiList = [
    {"index":1, "text":"微笑", },
    {"index":2, "text":"瘪嘴", },
    {"index":3, "text":"色", },
    {"index":4, "text":"发呆", },
    {"index":5, "text":"哭", },
    {"index":6, "text":"害羞", },
    {"index":7, "text":"闭嘴", },
    {"index":8, "text":"困", },
    {"index":9, "text":"大哭", },
    {"index":10, "text":"尴尬", },

    {"index":11, "text":"发怒", },
    {"index":12, "text":"调皮", },
    {"index":13, "text":"龇牙", },
    {"index":14, "text":"惊讶", },
    {"index":15, "text":"难过", },
    {"index":16, "text":"囧", },
    {"index":17, "text":"抓狂", },
    {"index":18, "text":"吐", },
    {"index":19, "text":"偷笑", },
    {"index":20, "text":"可爱", },

    {"index":21, "text":"白眼", },
    {"index":22, "text":"傲慢", },
    {"index":23, "text":"饥饿", },
    {"index":24, "text":"困", },
    {"index":25, "text":"惊恐", },
    {"index":26, "text":"汗", },
    {"index":27, "text":"憨笑", },
    {"index":28, "text":"悠闲", },
    {"index":29, "text":"奋斗", },
    {"index":30, "text":"咒骂", },

    {"index":31, "text":"疑问", },
    {"index":32, "text":"嘘", },
    {"index":33, "text":"晕", },
    {"index":34, "text":"抓狂", },
    {"index":35, "text":"衰", },
    {"index":36, "text":"敲打", },
    {"index":37, "text":"再见", },
    {"index":38, "text":"擦汗", },
    {"index":39, "text":"抠鼻", },
    {"index":40, "text":"糗大了", },

    {"index":41, "text":"坏笑", },
    {"index":42, "text":"左哼哼", },
    {"index":43, "text":"右哼哼", },
    {"index":44, "text":"哈欠", },
    {"index":45, "text":"鄙视", },
    {"index":46, "text":"委屈", },
    {"index":47, "text":"要哭了", },
    {"index":48, "text":"阴险", },
    {"index":49, "text":"亲亲", },
    {"index":50, "text":"吓", },

    {"index":51, "text":"可怜", },
    {"index":52, "text":"拥抱", },
    {"index":53, "text":"月亮", },
    {"index":54, "text":"太阳", },
    {"index":55, "text":"炸弹", },
    {"index":56, "text":"骷髅", },
    {"index":57, "text":"菜刀", },
    {"index":58, "text":"猪头", },
    {"index":59, "text":"西瓜", },
    {"index":60, "text":"咖啡", },

    {"index":61, "text":"饭", },
    {"index":62, "text":"爱心", },
    {"index":63, "text":"强", },
    {"index":64, "text":"弱", },
    {"index":65, "text":"握手", },
    {"index":66, "text":"胜利", },
    {"index":67, "text":"抱拳", },
    {"index":68, "text":"勾引", },
    {"index":69, "text":"OK", },
    {"index":70, "text":"NO", },

    {"index":71, "text":"玫瑰", },
    {"index":72, "text":"凋谢", },
    {"index":73, "text":"嘴唇", },
    {"index":74, "text":"爱情", },
    {"index":75, "text":"飞吻", },
]

function getAvataIndexByCode(code){
    for(var i=0; i<EnojiList.length; ++i){
        if(code === EnojiList[i].text){
            return EnojiList[i].index;
        }
    }
    return -1;
}