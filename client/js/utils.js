
//生成UUID
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
    return uuid;
  }

//时间戳转换成字符串
function stampToTime(timestamp){
    let d = new Date(timestamp)
    let date = (d.getFullYear()) + "-" + 
        (d.getMonth() + 1) + "-" +
        (d.getDate()) + " " + 
        (d.getHours()) + ":" + 
        (d.getMinutes()) + ":" + 
        (d.getSeconds());
    return date;
} 

/*
https://www.runoob.com/jsref/jsref-substring.html
JavaScript substring() 方法
String 对象参考手册 JavaScript String 对象
定义和用法
substring() 方法用于提取字符串中介于两个指定下标之间的字符。

substring() 方法返回的子串包括 开始 处的字符，但不包括 结束 处的字符。

语法
string.substring(from, to)

参数	描述
from	必需。一个非负的整数，规定要提取的子串的第一个字符在 string Object 中的位置。
to	可选。一个非负的整数，比要提取的子串的最后一个字符在 string Object 中的位置多 1。
如果省略该参数，那么返回的子串会一直到字符串的结尾。
*/
//表情字符串查找&替换
//聊天表情替换
function emojiToHtml(text){
    if(text.length<3){
      return text;
    }
    //添加聊天消息
    var begin = 0;
    var end = 0;
    var lastFindPos = 0;
    var html = "";
    while(begin < text.length){
      begin = text.indexOf('[', begin);
      if(begin == -1){
        break;
      }
      end = text.indexOf(']', begin+2);
      if(end == -1){
        break;
      }
      var count = end -begin-1;
      if(count>3){
        begin = end + 1;
        continue;
      }
      var code = text.substring(begin+1, end);
      var index = getAvataIndexByCode(code);
      if(index === -1){
        begin = end + 1;
        continue;
      }
      if(begin-lastFindPos>0){
        //textArray.push(text.substring(lastFindPos, begin));
        html += text.substring(lastFindPos, begin);
      }
      var imgText = "<img src=\"img/emoji/" + index + ".gif\" width=\"20px\" height=\"20px\">";
      html += imgText;
      lastFindPos = end + 1;
      begin = end +1;
    }
    if(lastFindPos == 0){
      html = text;
    }
    else{
      html += text.substring(lastFindPos);
    }
    return html;
  }

function getImgInfo(url){
  var img = new Image();
  img.src = url;
  if(img.complete){
    // 如果图片被缓存，则直接返回缓存数据
  }else{
    img.onload = function(){
      
    }
  }
}