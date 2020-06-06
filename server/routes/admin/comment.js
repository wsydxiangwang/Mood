module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Article = require('../../models/article')
    const Comment = require('../../models/comment')        
    const Counter = require('../../models/counter')
    const dateFormat = require('../../plugins/dateFormat')
    const requestResult = require('../../plugins/requestResult')

    const sendEmail = require('../../plugins/email')

    // Get comment
    router.get('/comment', async (req, res) => {
        const p = req.query.page || 1;
        const s = req.query.count || 10;
        const result = await Promise.all([
            Comment.countDocuments(),
            Comment.find().sort({"time":-1}).limit(Number(s)).skip(Number(s)*(p-1))
        ])

        result[1].forEach(item => item._doc['time'] = dateFormat(item.time) )

        res.send(requestResult({total: result[0], data: result[1], page: p}))
    })

    // Delete
    router.delete('/comment/:id', async (req, res) => {
        const data = await Comment.findByIdAndDelete(req.params.id)
        res.send(requestResult(data))
    })

    // Reply
    router.post('/comment', async (req, res) => {
        const commentCount = await Counter.findOneAndUpdate({
            name: 'comment'
        }, {
            $inc: { 'count' : 1 }
        }, {
            new: true
        }, (err, doc) => {
            return doc;
        })

        // 添加评论id
        req.body.id = commentCount.count;
        const result = await Comment.create(req.body)
        res.send(requestResult(result))
        
        const articleData = await Article.findOne({id: req.body.topic_id})

        const title = articleData.title,
              url = req.body.url,
              name = req.body.reply_name,
              email = req.body.reply_email;

        // 发送邮件
        sendEmail(title, url, name, email)
    })

    router.post('/uploader', async (req, res) => {
        console.log(req.body)
    })


    // 上传图片到阿里云oss使用
    // var fs = require('fs');
    // // 初始化Client
    // var co = require('co');
    // var OSS = require('ali-oss');
    // var client = new OSS({
    //     region: 'oss-cn-shenzhen',//填写你开通的oss
    //     accessKeyId: 'LTAI4G3Je77pHXwGZoTriHL6',
    //     accessKeySecret: 'JfwnNIkcaFIRuZIFw5dtbtrprelUrO'
    // });

    // var ali_oss = {
    //     bucket: 'img-wsydxiangwang',  // bucket name
    //     endPoint: 'oss-cn-shenzhen.aliyuncs.com', // oss地址
    // }

    // //图片上传
    // var multer  = require('multer')
    // var upload = multer({ dest: './tmp/' })

    // router.post('/upload',upload.single('file'),function(req, res, next){
    //     //  文件路径
    //     var filePath = './' + req.file.path;  
    //     // 文件类型
    //     var temp = req.file.originalname.split('.');
    //     var fileType = temp[temp.length - 1];
    //     var lastName = '.' + fileType;
    //     // 构建图片名
    //     var fileName = Date.now() + lastName;
    //     // 图片重命名
    //     fs.rename(filePath, fileName, (err) => {
    //         if (err) {
    //             res.json(JSON.stringify({status:'102',msg:'文件写入失败'}));   
    //         }else{
    //             var localFile = './' + fileName;  
    //             var key = 'image/'+fileName;

    //             // 阿里云 上传文件 
    //             co(function* () {
    //                 client.useBucket(ali_oss.bucket);
    //                 var result = yield client.put(key, localFile);
    //                 //自定义使用域名访问图片，（别忘记把域名解析至oss）
    //                 var imageSrc = 'http://***.com/' + result.name;
    //                 // 上传之后删除本地文件
    //                 fs.unlinkSync(localFile);
    //                 res.json(JSON.stringify({status:'100',msg:'上传成功',imageUrl:imageSrc})); 
    //             }).catch(function (err) {
    //                 // 上传之后删除本地文件
    //                 fs.unlinkSync(localFile);
    //                 res.json(JSON.stringify({status:'101',msg:'上传失败',error:JSON.stringify(err)})); 
    //             });
    //         }
    //     });
    // })

    app.use('/admin/api', router)
}