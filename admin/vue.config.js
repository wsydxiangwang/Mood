/**
 * outputDir: 指定打包目录
 * publicPath: 判断环境 切换访问域名
 */
module.exports = {
    outputDir: __dirname + '/../server/admin',
    publicPath: process.env.NODE_ENV === 'production' ? '/admin' : '/',
    devServer:{
        proxy: {
            '/uploads': {
                target: 'http://server:3000',
                ws: true,
                changeOrigin: true
            }
        }
    }
}