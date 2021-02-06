module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let { Info } = model
    let { RequestResult } = plugin
    
    const fs = require('fs');
    const multer = require('multer')

    /**
     * 指定文件类型、名字、路径
     */
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const name = file.mimetype.includes('image') ? 'image' : 'music';
            cb(null, `./uploads/${name}`)
        },
        filename: (req, file, cb) => {
            const temp = file.originalname.split('.');
            const name = Date.now() + '.' + temp.pop();
            cb(null, name)
        }
    })
      
    const upload = multer({ storage })

    // 上传文件
    router.post('/upload', upload.single('file'), async (req, res, next) => {
        if (req.body.type == '阿里云') {
            // 获取oss
            if (req.body.oss) {
                var oss = JSON.parse(req.body.oss)
            } else {
                const result = await Info.find()
                var oss = result['aliyun_oss']
            }

            //  文件信息
            const localFile = `./${req.file.path}`;
            const filename = req.file.mimetype.includes('image') ? 'image' : 'music';
            const path = `Mood/${filename}/${req.file.filename}`;

            try {
                const OSS = require('ali-oss')
                const client = new OSS({
                    bucket: oss.bucket,
                    region: oss.region,
                    accessKeyId: oss.accessKeyId,
                    accessKeySecret: oss.accessKeySecret
                })
                const result = await client.put(path, localFile)
                /**
                 * 移除本地文件
                 * 自定义域名
                 */
                fs.unlinkSync(localFile)
                const data = { 
                    url: oss.domain ? `${oss.domain}/${result.name}` : result.url 
                }
                res.send(RequestResult(1, data))
            } catch (e) {
                res.send(RequestResult(2, { message: '图片上传失败，请填写正确的OSS信息！'}))
            }
        } else {
            const filePath = (req.file.path).replace(/\\/g,"\/")
            const data = {
                url: `/${filePath}` ,
                message: '上传成功'
            }
            res.send(RequestResult(1, data))
        }
    })

    // 删除文件
    // router.post('/delete_file', async (req, res, next) => {
    //     const type = req.body.type

    //     const localFile = `./${req.body.url}`;
    //     if(type == '阿里云'){
    //         const result = await Info.find()
    //         const oss = result[0].upload_oss

    //         const OSS = require('ali-oss');
    //         const client = new OSS({
    //             region: oss.region,//填写你开通的oss
    //             accessKeyId: oss.accessKeyId,
    //             accessKeySecret: oss.accessKeySecret
    //         });
    //         const ali_oss = {
    //             bucket: oss.bucket,  // bucket name
    //             endPoint: oss.endPoint, // oss地址
    //         }
    
    //         //  文件路径
    //         const key = localFile.slice(localFile.indexOf('Mood'));

    //         // 删除文件
    //         co(function* () {
    //             client.useBucket(ali_oss.bucket);
    //             const result = yield client.delete(key);
    //             res.json({
    //                 status:  100,
    //                 msg: '删除成功'
    //             }); 
    //         })
    //     }else{
    //         fs.unlinkSync(localFile);
    //         res.json({
    //             status:  100,
    //             msg: '删除成功'
    //         }); 
    //     }
    // })

    app.use('/admin/api', router)
}