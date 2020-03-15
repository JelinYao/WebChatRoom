# WebChatRoom
使用Node.js + socket.io搭建基于HTML5的在线聊天室

## 架构
（1）服务端：Node.js + socket.io实现消息传输

Node.js官方文档：http://nodejs.cn/

socket.io中文学习文档：https://zhuanlan.zhihu.com/p/29148869

（2）B端：HTML5 + Javascript实现简单界面功能

## 使用方法
1、安装Node.js客户端，使用npm安装express、socket.io等基础组件

2、调试运行代码

（1）推荐使用VS Code打开webchatroom目录，调试server.js。

（2）浏览器中输入localhost，打开前端聊天窗口页面（可以打开多个）。

（3）发消息，测试多人聊天功能。

## 更新记录

1、2020年3月15日21:49:14

（1）增加Python工具代码，下载表情文件并保存到本地；

（2）实现QQ表情输入及群发功能。

## 聊天室运行图

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/screen.png)

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/emoji.png)