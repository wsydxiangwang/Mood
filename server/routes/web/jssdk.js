module.exports = app => {
    const cache = require('memory-cache')
    const express = require('express');
    const request = require('request');
    const crypto = require('crypto');
    const router = express.Router();

    app.use('/wx', express.static('static'));

    router.get('/getsign', function (req, res) {
        const config = {
            "token":"test",
            "appId":"wxc21bbf3b44300995",
            "appSecret":"d14ec662e8dc144627c9ef3c19352f73"
        }
        var noncestr = "123456",
            timestamp = Math.floor(Date.now() / 1000), //精确到秒
            url = req.headers.referer,
            appId = config.appId,
            jsapi_ticket;
        
        // 获取缓存的ticket
        if (cache.get('ticket')) {
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
            // 获取access_token
            request(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appId}&secret=${config.appSecret}`, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var tokenMap = JSON.parse(body);
                    // 获取jsapi_ticket
                    request(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenMap.access_token}&type=jsapi`, (error, resp, json) => {
                        if (!error && response.statusCode == 200) {
                            var ticketMap = JSON.parse(json);
                            // 加入缓存
                            cache.put('ticket', ticketMap.ticket, (1000 * 60 * 60 * 24));
                            var obj = {
                                noncestr: noncestr,
                                timestamp: timestamp,
                                url: url,
                                appId: appId,
                                jsapi_ticket: ticketMap.ticket,
                                signature: crypto.createHash('sha1').update(`jsapi_ticket=${ticketMap.ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`).digest('hex')
                            }
                            res.send(obj)
                        }
                    })
                }
            })
        }
    });
    app.use('/web/api', router)
}

