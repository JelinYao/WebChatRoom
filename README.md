# WebChatRoom
使用Node.js + socket.io搭建基于HTML5的在线聊天室，支持文字、表情、图片消息群发。

## 更新记录

1、2020年3月15日21:49:14

（1）增加Python工具代码，下载表情文件并保存到本地；

（2）实现QQ表情输入及群发功能。

2、2020年3月16日22:00:41

（1）修复JavaScript实现的链表控件内的bug；

（2）修复下线通知无法接受的bug。

3、2020年3月18日22:28:40

（1）增加右侧群聊用户列表展示；

（2）实时更新群聊用户信息。

4、2020年3月22日21:48:06

（1）服务端node.js增加上传图片接口；

（2）客户端增加图片消息协议，支持发送图片消息。

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


## 截图

1、发送图片

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/chat3.png)

2、发送表情

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/chat2.png)

3、群聊

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/screen.png)

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/emoji.png)

![](https://raw.githubusercontent.com/JelinYao/WebChatRoom/master/img/chat1.png)

