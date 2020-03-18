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
    socket = io('http://localhost');
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
    case BoardcastType.BtMessage:
      addChatMessage(msg);
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
  //先判断要不要添加时间
  if(msg.time - lastMsgTime > 60000){
    var date = stampToTime(msg.time);
    addSystemMessage(date);
  }
  lastMsgTime = msg.time;
  //再把聊天记录加入列表
  var isMyself = (msg.user.id === me.id);
  var div1 = document.createElement('div');
  div1.setAttribute('class', 'person');
  div1.setAttribute('data-chat', '');
  var div2 = document.createElement('div');
  div2.setAttribute('style', isMyself ? 'float: right;' : 'float: left;');
  var img = document.createElement('img');
  img.src = msg.user.avata;
  img.setAttribute('class', 'avataImg');
  div2.appendChild(img);
  div1.appendChild(div2);
  //表情处理
  html = emojiToHtml(msg.data.value);
  var div3 = document.createElement('div');
  div3.setAttribute('class', isMyself ? 'bubble me' : 'bubble you');
  div3.innerHTML = html;
  div1.appendChild(div3);
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

/* <li class="person" data-chat="robot">
                    <img src="img/avata/8.png" alt="" />
                    <span class="name">chat room robot</span>
                    <span class="time">2:09 PM</span>
                    <span class="preview">I'm a robot...</span>
                </li> */