/*****************************
 * Node.js学习代码
 * 测试socket.io聊天室
 * socket.io官网：https://socket.io/
 * github: https://github.com/JelinYao/Node.jsStudy

 */
var fs = require('fs');
var express = require('express');
var app = express();
var multiparty = require('multiparty');
var https = require('https');
let path = require('path');
var defineModule = require('./define');
var roomList = defineModule.data.roomList;

var logModule = require('./log');
const logger = logModule.getLogger();
const errorLogger = logModule.getLogger('err');


//https://localhost/index.html
//配置HTTPS证书（此证书为免费证书：https://freessl.cn/）
var options = {
    key:fs.readFileSync('.\\key\\www.jelinyao.cn_key.key'),
    cert:fs.readFileSync('.\\key\\www.jelinyao.cn_chain.crt')
};
var server = https.Server(options, app);
var io = require('socket.io')(server);
//监听HTTPS端口443
//https.createServer(options, app).listen(443);
server.listen(443);
//设置本地静态资源路径
app.use(express.static(path.join(__dirname, './client')));

//返回主页地址
app.get('/', (request, response)=>{
    //response.writeHead(200, {'Content-Type': 'text/html;charset:utf-8'});
    response.sendFile(__dirname + '/client/chat.html');
})

//获取房间列表
app.get('/roomList', (request, response)=>{
    var result = {};
    result.code = 200;
    result.data = roomList;
    response.writeHead(200, {'content-type': 'application/json;charset=utf-8'});
    response.write(JSON.stringify(result));
    response.end();
})

//上传文件
app.post('/uploadChatImg', (request, response)=>{
    try{
        //生成multiparty对象，并配置上传目标路径 
        var form = new multiparty.Form();
        form.encoding = 'utf-8';
        //设置文件存储路劲
        form.uploadDir = '.\\client\\img\\chat\\';
        fs.stat(form.uploadDir, function(error, stats){
            if(error){
                fs.mkdirSync(form.uploadDir);
            }
        });
        //设置文件大小限制
        form.maxFilesSize = 3*1024*1024;
        form.parse(request, (error, fields, files)=>{
            if(error){
                console.log(error);
                response.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
                response.write('upload file: \n\n' + error);
                response.end();
                return;
            }
            var inputFile = files.file[0];
            var pos = inputFile.originalFilename.indexOf('.');
            var imgExt = '';
            if(pos !== -1){
                imgExt = inputFile.originalFilename.substring(pos);
            }
            var uploadPath = inputFile.path;
            var destPath = ".\\client\\img\\chat\\" + fields.md5 + imgExt;
            //重命名为真实文件名
            fs.rename(uploadPath, destPath, function(error){
                var result = {};
                 if(error){
                    console.log("rename error: "+ error);
                    result.code = -1;
                    result.msg = error;
                }else{
                    result.code = 200;
                    result.msg = 'OK';
                    result.url = 'img/chat/' + fields.md5 + imgExt;
                }
                response.writeHead(200, {'content-type': 'text/plain'});
                var json = JSON.stringify(result);
                response.write(json);
                response.end();
            });
        });
    }
    catch(e){
        console.error(e);
    }

})

app.post('/queryImg', (request, response)=>{
    var md5 = request.md5;
    var file = '.\\img\\chat\\' + md5;
    var reader = new FileReader();
    var result = {};
    reader.onerror = function(e){
        //文件不存在
        result.code = 404;
        reader.msg = e;
    }
    reader.onload = function(e){
        //文件存在
        result.code = 200;
        reader.msg = 'Image exists';
    }
    response.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
    response.write(JSON.stringify(result));
    response.end();
})

logger.info('启动websocket.io服务器，创建房间');
var chatroomModule = require('./chatroom');
var chatroom = chatroomModule.chatroom;
for(var i=0;i<roomList.length;++i){
    var room = new chatroom(io, roomList[i].id, roomList[i].limit, roomList[i].name);
}


//监听HTTP端口，重定向到HTTPS
var http = require('http');
var http_app = express();
var http_server = http.Server(http_app);
http_server.listen(80);

http_app.get("*", (req, res, next) => {
    let host = req.headers.host;
    host = host.replace(/\:\d+$/, '');
    res.redirect(`https://${host}${req.path}`);
})