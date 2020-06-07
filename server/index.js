const express = require('express');
const history = require('connect-history-api-fallback');
const expressJwt = require("express-jwt");
const router = express.Router();

const app = express();

app.use(history({
    index: '/admin/index.html'
}))

app.use(require('cors')())
app.use(express.json())

app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'));

// app.get('/uploads/*', function (req, res) {
//     console.log( __dirname + "/" + req.url )
//     res.sendFile( __dirname + "/" + req.url );
// })
// app.get('/', function (req, res) {
//     res.send('Hello World');
//   })
/**
 * 验证token是否过期 
 * 前台无需验证路由
 */
app.use(expressJwt({
    secret: "Libai"
}).unless({
    path: ["/admin/api/login"]
}));

// 中间件
app.use(function(err, req, res, next) {
    // 跳过前台接口验证
    if(req.originalUrl.slice(1, 4) == 'web'){
        return next();
    }
    // Token过期
    if (err.name === "UnauthorizedError") {
        res.status(err.status || 401);
        res.json({
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

require('./routes/web')(app)
require('./routes/web/jssdk')(app)

require('./plugins/db')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000!')
})