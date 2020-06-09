module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const multer  = require('multer')
    const fs = require('fs');
    const co = require('co');

    const Info = require('../../models/info')
    const requestResult = require('../../plugins/requestResult')

    router.get('/info', async (req, res) => {
        const result = await Info.find()
        res.send(requestResult(result))
    })

    router.post('/info', async (req, res) => {
        console.log(req.body._id)
        if(req.body._id){
            const result = await Info.findByIdAndUpdate(
                req.body._id, 
                req.body, 
                (err, doc) => {
                    return doc
                })
            res.send(requestResult(result))
        }else{
            const result = await Info.create(req.body)
            res.send(requestResult(result))
        }
    })


    /**
     * 阿里云OSS
     */
    const OSS = require('ali-oss');
    const client = new OSS({
        region: 'oss-cn-shenzhen',//填写你开通的oss
        accessKeyId: 'LTAI4G3Je77pHXwGZoTriHL6',
        accessKeySecret: 'JfwnNIkcaFIRuZIFw5dtbtrprelUrO'
    });
    const ali_oss = {
        bucket: 'img-wsydxiangwang',  // bucket name
        endPoint: 'oss-cn-shenzhen.aliyuncs.com', // oss地址
    }

    /**
     * 指定文件名和路径
     */
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const name = file.mimetype.includes('image') ? 'image' : 'music';
            cb(null, `./uploads/${name}`)
        },
        filename: (req, file, cb) => {
            const temp = file.originalname.split('.');
            const lastName = '.' + temp.pop();
            const fileName = Date.now() + lastName;
            cb(null, fileName)
        }
    })
      
    const upload = multer({ storage })

    router.post('/upload', upload.single('file'), (req, res, next) => {
        const filePath = (req.file.path).replace(/\\/g,"\/");

        // res.json({status:'100', msg:'上传成功', imageUrl: `/${filePath}` });
        
        console.log(req.file)

        //  文件路径
        const localFile = `./${req.file.path}`;
        const key = `Mood/image/${req.file.filename}`;

        // 阿里云 上传文件 
        co(function* () {
            client.useBucket(ali_oss.bucket);
            const result = yield client.put(key, localFile);

            //自定义使用域名访问图片，（别忘记把域名解析至oss）
            // const image = `result.url`;

            const image = `https://image.raindays.cn/${result.name}`;

            fs.unlinkSync(localFile);   // 上传之后删除本地文件
            res.json({
                status: '100',
                msg: '上传成功',
                image: image
            }); 
        }).catch(function (err) {
            fs.unlinkSync(localFile);
            res.json({
                status: '101',
                msg: '上传失败',
                error: JSON.stringify(err)
            }); 
        });
    })

    app.use('/admin/api', router)
}