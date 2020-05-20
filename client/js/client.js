//当前用户信息
var me = {
  id : 0,
  name : '',
  avata : '',
  uuid : '',
  socketId : ''
}
//上次消息时间
var lastMsgTime = 0;
window.onload = function (){
  this.initEmoji();
  this.me.uuid = uuid();
  this.EnterRoom();
}

var socket = null;
//重连次数
var retry_count = 0;
function EnterRoom(){
    if(socket != null && socket.connected){
        alert("socket is already connected!");
        return;
    }
    //这里使用的是我的内网地址，方便在虚拟机、手机上也可以测试
    socket = io(SERVER);
    //连接上服务端
    socket.on('connect', ()=>{
        //var osInfo = getOsInfo();
        //注册账号
        socket.emit('register', me);
        console.log("register: ", me);
    });
    //聊天
    socket.on('chat', data=>{
        console.log("chat: ", JSON.stringify(data));
        //群发消息
        addMessage(data);
    });

    //广播消息
    socket.on('broadcast', data=>{
      console.log("broadcast: ", data);

    })
    //重连
    socket.on('reconnect_attempt', ()=>{
        //addMsgToHtml('本机[' + socket.id + ']: 尝试重新连接服务器');
        console.log("本机掉线，尝试重连服务器");
    });
}

//收到聊天消息
function addMessage(msg){
  switch(msg.type){
    case BoardcastType.BtEnterRoom:
      //当前用户加入列表
      addUserToList(msg.user);
      if(msg.user.uuid === me.uuid){
        //用户信息更新
        me.id = msg.user.id;
        me.name = msg.user.name;
        me.avata = msg.user.avata;
        me.socketId = msg.user.socketId;
        return;
      }
      text = msg.user.name + '进入聊天室';
      addSystemMessage(text)
      break;
    case BoardcastType.BtExitRoom:
      text = msg.user.name + '离开聊天室';
      addSystemMessage(text)
      delUserFromList(msg.user);
      break;
    case BoardcastType.BtMessage:{
      //先判断要不要添加时间
      if(msg.time - lastMsgTime > 60000){
        var date = stampToTime(msg.time);
        addSystemMessage(date);
      }
      lastMsgTime = msg.time;
      addChatMessage(msg);
    }
      break;
    case BoardcastType.BtUserList:
      //先清空列表
      clearList();
      addUserToList(me);
      //加入列表
      var userList = msg.user;
      for(var i=0; i<userList.length; ++i){
        addUserToList(userList[i]);
      }
      break;
      case BoardcastType.BtUserFull:
        socket.disconnect(true);
        alert('聊天室人数已满，无法加入！');
        break
  }
}

//添加系统消息
function addSystemMessage(msg){
  var div = document.createElement('div');
  div.setAttribute('class', 'bubble system');
  div.setAttribute('align', 'center');
  var span = document.createElement('span');
  span.innerText = msg;
  div.appendChild(span);
  //div.innerText = msg;
  document.querySelector('.chat[data-chat=room]').appendChild(div);
}

//添加聊天消息
function addChatMessage(msg){
  var isMyself = (msg.user.id === me.id);
  var div1 = document.createElement('div');
  div1.setAttribute('class', 'person');
  div1.setAttribute('data-chat', msg.user.id);
  //创建头像展示div
  var divAvatar = document.createElement('div');
  divAvatar.setAttribute('style', isMyself ? 'float: right;' : 'float: left;');
  //创建用户头像
  var img = document.createElement('img');
  img.src = msg.user.avata;
  img.setAttribute('class', 'avataImg');
  divAvatar.appendChild(img);
  
  var html = '';
  switch(msg.data.type){
    case MessageType.MtText:
      var content = msg.data.value;
      //正则表达式 from https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
      var expression = /(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
      html = content.replace(expression, function($url){
        return "<a class='chatUrl' href='" + $url + "' target='_blank'>" + $url + "</a>";
      });
      html = emojiToHtml(html);
      break;
    case MessageType.MtImage:
      html = "<img src=\"" + msg.data.value + "\" style=\"width:140px;height:180px;\">";
      break;
  }
  //创建文字展示div
  var divText = document.createElement('div');
  divText.setAttribute('class', isMyself ? 'bubble me' : 'bubble you');
  divText.innerHTML = html;
  if(isMyself){
    div1.appendChild(divText);
    div1.appendChild(divAvatar);
  }
  else{
    div1.appendChild(divAvatar);
    div1.appendChild(divText);
  }
  var div = document.getElementById('chatRoomDIV');
  div.appendChild(div1);
  //滚动条滚动到底部
  div.scrollTop = div.scrollHeight;
}

//发送文字消息
function sendTextMessage(){
  if(socket == null && socket.disconnected){
    alert("socket is disconnected!");
    return;
  }
  var input = document.getElementById('input_text');
  var text = input.value;
  if(text.length == 0){
    alert('请先输入发送内容');
    return;
  }
  input.value = '';
  var msg = {data:{}};
  msg.type = BoardcastType.BtMessage;
  msg.user = me;
  msg.time = new Date().getTime();
  msg.data.type = MessageType.MtText;
  msg.data.value = text;
  socket.emit('chat', msg);
  console.log("send chat: ", msg);
  addChatMessage(msg);
}

function onInputKeydown(event){
  if (event.key == 'Enter'){
    sendTextMessage();
}
}

function initEmoji(){
  var div = document.querySelector('.emojiDIV');
  for(var i=0; i<EnojiList.length; ++i){
    var img = document.createElement('img');
    img.title = EnojiList[i].text;
    img.src = ImgPath + EnojiList[i].index + ".gif";
    var code = "[" + EnojiList[i].text + "]";
    img.setAttribute('code', code);
    img.onclick = onInputEmoji;
    div.appendChild(img);
  }
}

function onInputEmoji(event){
  var code = event.target.getAttribute('code');
  var input = document.getElementById('input_text');
  var text = input.value + code;
  input.value = text;
  hideEmojiDiv();
}

function onClickEmoji(){
  var div = document.getElementById('emojiDIVid');
  var display = div.style.display;
  if(display === "none"){
    div.style.display = "";
  }
  else{
    div.style.display = "none";
  }
}

function hideEmojiDiv(){
  var div = document.getElementById('emojiDIVid');
  if(div !== null)
    div.style.display = "none";
}

//添加到右侧群成员列表
function addUserToList(user){
  var li = document.createElement('li');
  li.setAttribute('class', 'person');
  li.setAttribute('id', user.socketId);
  var img = document.createElement('img');
  img.src = user.avata;
  li.appendChild(img);
  var spanName = document.createElement('span');
  spanName.setAttribute('class', 'name');
  spanName.innerText = user.name;
  li.appendChild(spanName);
  var spanTime = document.createElement('span');
  spanTime.setAttribute('class', 'time');
  var now = new Date();
  var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  spanTime.innerText = time;
  li.appendChild(spanTime);
  var spanSay = document.createElement('span');
  spanSay.setAttribute('class', 'preview');
  li.appendChild(spanSay);
  var ul = document.getElementById('userListUL');
  ul.appendChild(li);
}

//从右侧群成员列表移除
function delUserFromList(user){
  var li = document.getElementById(user.socketId);
  var ul = document.getElementById('userListUL');
  ul.removeChild(li);
}

function clearList(){
  var ul = document.getElementById('userListUL');
  ul.innerHTML = '';
}

function onClickImg(){
  try{
    var input = document.getElementById('input_file');
    if(input === undefined || input === null){
      input = document.createElement('input')
      input.setAttribute('id','input_file');
      input.setAttribute('type','file');
      input.setAttribute('name','file');
      input.setAttribute('accept', 'image/*');
      input.setAttribute("style",'visibility:hidden;');
      input.addEventListener('change', ()=>{
        console.log(input.value);
        if(input.files.length === 0){
          //没有选择图片
          return;
        }
        var size = input.files[0].size;
        if(size>MaxImgSize){
          alert("图片大小超过" + MaxImgSize + "无法发送");
          return;
        }
        //计算图片md5
        var reader = new FileReader();
        reader.onload = function(e){
          var data = e.target.result;
          var imgMD5 = md5(data);
          console.log('img md5: ' + imgMD5);
          // var form = new FormData(), url = SERVER + '/queryImg';
          // form.append('md5', imgMD5);
          // requestUrl(url, form, function(){
          // });
          //查询图片是否存在
          var form = new FormData(), url = SERVER + '/uploadChatImg', file = input.files[0];
          form.append('file', file);
          form.append('md5', imgMD5);
          var xhr = new XMLHttpRequest();
          xhr.open("post", url, true);
          xhr.addEventListener('readystatechange', function(){
            var result = xhr;
            if (result.status != 200) { //error
                console.log('上传失败', result.status, result.statusText, result.response);
            } 
            else if (result.readyState == 4) { //finished
                console.log('上传成功', result);
                var response = JSON.parse(result.responseText);
                if(response.code != 200){
                  console.log(response.msg);
                  return;
                }
                sendImgMessage(response.url);
            }
          });
          xhr.send(form);
        }
        reader.readAsBinaryString(input.files[0]);
      });
      document.body.appendChild(input);
    }
    input.click();
   }catch(e){ 
    alert(e.message);
   }
}

function sendImgMessage(url){
  var msg = {data:{}};
  msg.type = BoardcastType.BtMessage;
  msg.user = me;
  msg.time = new Date().getTime();
  msg.data.type = MessageType.MtImage;
  msg.data.value = url;
  socket.emit('chat', msg);
  addChatMessage(msg);
}