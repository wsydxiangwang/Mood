const express = require('express');
const history = require('connect-history-api-fallback');
const expressJwt = require("express-jwt");
const bodyParser = require('body-parser')

const app = express();

app.use(history({
    index: '/admin/index.html'
}))

app.use(require('cors')())                              // 跨域
app.use(express.json())                                 // JSON转换
app.use(bodyParser.json());                             // 数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));    // 解析post请求数据


/**
 * 静态文件
 */
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'));

/**
 * 验证token
 * 跳过用户接口
 */
app.use(expressJwt({
    secret: "Libai"
}).unless({
    path: ["/admin/api/login", "/admin/api/user"]
}));

// 中间件
app.use((err, req, res, next) => {
    // 跳过前台接口验证
    if(req.originalUrl.slice(1, 4) == 'web'){
        return next();
    }
    // Token过期
    if (err.name === "UnauthorizedError") {
        res.status(err.status || 401);
        res.send({
            message: 'token过期，请重新登录',
            code: 401,
            time: err.inner.expiredAt
        })
        return
    }
});


require('./routes/admin/login')(app)
require('./routes/admin/comment')(app)
require('./routes/admin/article')(app)
require('./routes/admin/envelope')(app)
require('./routes/admin/upload')(app)
require('./routes/admin/info')(app)
require('./routes/admin/myself')(app)

require('./routes/web')(app)
require('./routes/web/jssdk')(app)

require('./plugins/db')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000!')
})