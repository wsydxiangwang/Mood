const express = require('express')
const history = require('connect-history-api-fallback')
const expressJwt = require("express-jwt")
const bodyParser = require('body-parser')
const fs = require('fs')

const app = express()

app.use(history({
    index: '/admin/index.html'
}))

app.use(require('cors')())                              // 跨域
app.use(express.json())                                 // JSON转换
app.use(bodyParser.json())                              // 数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }))     // 解析post请求数据

/**
 * 静态文件
 */
app.use('/admin', express.static(__dirname + '/admin'))
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use('/assets', express.static(__dirname + '/assets'))

/**
 * 验证token
 * 跳过用户接口
 */
const verifyToken = ['login', 'user', 'forgotPassword'].map(i => '/admin/api/' + i)
app.use(expressJwt({
    secret: "Libai"
}).unless({
    path: [ ...verifyToken ]
}))

// 接口验证
app.use((err, req, res, next) => {
    if (req.originalUrl.slice(1, 4) == 'web') { // 跳过前台
        return next()
    }
    if (err.name === "UnauthorizedError") {     // Token过期
        res.status(err.status || 401)
        res.send({
            message: 'token过期，请重新登录',
            code: 401,
            time: err.inner.expiredAt
        })
        return
    }
})

/**
 * 全局方法
 * 接口模块
 */
const fileName = ['plugins', 'models']
const global = fs.readdirSync(__dirname).filter(i => fileName.includes(i)).reduce((total, item) => {
    const files = fs.readdirSync(__dirname + '/' + item)
    files.map(i => {
        let name = i.replace('.js', '')
        let nameKey = i.replace('.js', '')
        if(item == 'models'){
            nameKey = name.replace(/^\S/, s => s.toUpperCase())
        }
        total[item][nameKey] = require(  __dirname + '/' + item + '/' +  name)
    })
    return total
}, {'plugins': {}, 'models': {}})

// 加载所有路由
const dirname = __dirname + '/routes'
fs.readdirSync(dirname).forEach((i) => {
    const file = dirname + '/' + i
    if (fs.statSync(file).isDirectory()) {
        fs.readdirSync(file).forEach(item => {
            const name = item.replace('.js', '')
            require( file + '/' + name )(app, global['plugins'], global['models'])
        })
    }
})


require('./plugins/db')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000')
})