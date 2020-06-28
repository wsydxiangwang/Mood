

终于好了，欢迎大家访问我的网站，[在这儿在这点我](https://raindays.cn)



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