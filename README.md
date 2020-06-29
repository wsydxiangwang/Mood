
Hello，大家好，我是李白～～

浪迹掘金之久，感谢各位大佬们的知识分享，感谢掘金这个平台，让我对自己的能力有了深度的认知，同时认识到诸位优秀、有趣的小伙伴们，请大家继续保持前进！！！

——上热门 专属开场白

第一次发帖子，有点小紧张，不知道待会给我点赞的会是哪位帅气的哥哥，还是漂亮的姐姐。

这是一个全栈之路的项目，从设计、前端、后端、服务端，一路狂飙学习，不发水帖，出品必属精品，要么沉默不语，要么一语惊人。

前后台均为绞尽脑汁的设计，整体风格为简约风，人的心灵到达一定阶段，心思愈渐愈偏向于简单，大道极简也许才是最终的归宿。
（前台页面有些部分是参考某开源站）

接触过WordPress，Hexo等第三方网站系统，但是呢，感觉太过于冗余臃肿，显得过于杂乱，各种限制和体验不好等等原因。

这些都不是自己想要的，所以才开启了自己的全栈之路。

被很多网友问，有没有这个网站的模板，肯定没有啊，这是我自己手写出来的啊。当然，我明白问这些问题的同学，目前的能力或想法仍需时间的磨练。

所以，我决定开源出来，让那些即使是小白鼠、小白兔、小白菜都能上手操作的一个发文章、做笔记、个人介绍的简单系统。

经过这段时间夜以继日的折腾，终于结束了，以实际操作来巩固过往的所学，更加深入认识了Node.js等基础，其中问题最多的非nuxt莫属。

只要心有所归，沿途的风景不管好与坏，一定会是最美的、最难以忘怀的存在，果然不虚此行。

原本这个世界就有很多东西是并没有什么意义的。

永远相信美好的事情即将发生

致迷途道路上的我们，感谢大家的支持，接受指点和批评，
欢迎指点一二（评论和GitHub）（不接受喷 /承受不住）

（我想，我应该不能再废话下去了，否则屏幕前的人，都得把掘金卸载掉了，就差砸手机电脑。巧了，我这儿刚好有手机电脑换不锈钢脸盆的业务，溜了溜了................）




技术栈

前台页面：Nuxt
后台页面：vue-cli、element-ui
后端数据：Node.JS、MongoDB
项目部署：Nginx、PM2



全栈好处

随心所欲的整自己想要的数据格式，而不是天天怼后端，天天背地里骂后端给的辣鸡数据，相信前端同学一定深有体会，哈哈哈

来一波页面图片（三流设计师）



欢迎大家使用，互相学习，如果觉得好用，右上角的star给我使劲的点，快点


你要有一个属于自己的服务器，或者免费的平台，反正能上传程序的都行。

我用的是阿里云的服务器，镜像信息为: `Ubuntu 18.04`

## 服务器安装程序

首先, 需要在服务器安装以下程序

```
nodejs
mongodb
pm2
nginx
```

## 上传项目文件

为了区分环境, 我们在根目录新建文件夹`data`, 并上传`web`和`server`两个文件夹, 因为`admin`后台项目是打包到`server`文件夹的, 所以在这里不用上传.

接着分别进入`web`和`server`目录, 各自`npm install`一下, 安装成功后, 测试一下是否正常.

- 在`server`目录, 执行命令`node index.js`, 打印成功则你懂的, 按`crtl+c`退出程序.

- 在`web`目录, 执行命令`npm run start`, 打印成功则你懂的.


## 开启服务

最后, 使用`pm2`来运行程序

```
pm2 start index.js --name="server   
pm2 start npm --name "my-nuxt" -- run start
```

## Nginx配置

安装nginx后, 还得手动配置nginx, 以下为关键字段

打开nginx配置文件`nginx.conf`, 路径一般是：`/etc/nginx/nginx.conf`。

```
server {
    listen 443;

    server_name xxx.com;  // 你的域名,,,,

    ##
    # SSL Settings
    ##

    ssl on;

    ##
    # 开启https证书地址
    ##
    ssl_certificate /etc/nginx/xxxx.com.pem;
    ssl_certificate_key /etc/nginx/xxxxx.com.key;

    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://127.0.0.1:8000;
    }

    location /admin {
        proxy_pass http://127.0.0.1:3000;
    }
}

server {
    listen 80;
    listen [::]:80;
    
    server_name xxx.com;  // 你的域名地址
    
    // 通过rewrite方式把所有http请求也转成了https请求
    rewrite ^(.*)$ https://$server_name$1 permanent;
    
	# reverse proxy
	location / {
		proxy_pass http://127.0.0.1:8000;
	}

	location /admin {
		proxy_pass http://127.0.0.1:3000;
	}
}
```

Nginx上传文件大小限制的问题, 所以需要加入以下字段, 方能正常上传

1.打开nginx配置文件`nginx.conf`, 路径一般是：`/etc/nginx/nginx.conf`。

2.在http{}段中加入`client_max_body_size 20m`; 20m为允许最大上传的大小。

3.保存后重启nginx，问题解决。(重启命令: `nginx -s reload`)

