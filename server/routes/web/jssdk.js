module.exports = app => {
    const cache = require('memory-cache')
    const express = require('express');
    const request = require('request');
    const crypto = require('crypto');
    const router = express.Router();
    
    router.get('/getsign', function (req, res) {
        const config = {
            "appId": "wxc21bbf3b44300995",
            "appSecret": "d14ec662e8dc144627c9ef3c19352f73"
        }
        var noncestr = "123456",
            timestamp = Math.floor(Date.now() / 1000), //精确到秒
            url = req.headers.referer,
            appId = config.appId,
            jsapi_ticket;

        // 获取缓存的ticket
        if (cache.get('ticket')) {

            console.log(1, 'ticket')

            jsapi_ticket = cache.get('ticket');
            var obj = {
                noncestr: noncestr,
                timestamp: timestamp,
                url: url,
                appId: appId,
                jsapi_ticket: jsapi_ticket,
                signature: crypto.createHash('sha1').update(`jsapi_ticket=${jsapi_ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`).digest('hex')
            };
            res.send(obj)
        } else {
            
            console.log(2, 'ticket')

            // 获取密匙
            function appSecret(){
                return new Promise((resolve, reject) => {
                    request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`, 
                        (error, response, body) => {
                            if (!error && response.statusCode == 200) {
                                resolve(JSON.parse(body))
                            }
                    })
                })
            }

            // 获取 access_token
            function accessToken(tokenMap){
                return new Promise((resolve, reject) => {
                    request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenMap.access_token}&type=jsapi`, 
                        (error, response, body) => {
                            if (!error && response.statusCode == 200) {                                
                                console.log(JSON.parse(body))
                                resolve(JSON.parse(body))
                            }
                    })
                })
            }

            // 获取成功
            appSecret()
            .then((tokenMap) => {
                return accessToken(tokenMap)
            })
            .then((ticketMap) => {
                cache.put('ticket', ticketMap.ticket, 1000 * 60 * 60 * 2); // 加入缓存 7200s
                var obj = {
                    noncestr: noncestr,
                    timestamp: timestamp,
                    url: url,
                    appId: appId,
                    jsapi_ticket: ticketMap.ticket,
                    signature: crypto.createHash('sha1').update(`jsapi_ticket=${ticketMap.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`).digest('hex')
                }
                res.send(obj)
            })
        }
    });
    app.use('/web/api', router)
}

