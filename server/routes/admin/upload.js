module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {Info} = model
    
    const fs = require('fs');
    const co = require('co');

    const multer  = require('multer')

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

    // 上传文件
    router.post('/upload', upload.single('file'), async (req, res, next) => {
        if(req.body.type == '阿里云OSS'){

            /**
             * 阿里云OSS
             */

            let oss = {};
            /**
             * 获取oss
             */
            if(req.body.upload_oss){
                oss = JSON.parse(req.body.upload_oss)
            }else{
                const result = await Info.find()
                oss = result[0].upload_oss
            }

            //  文件路径
            const localFile = `./${req.file.path}`;
            const filename = req.file.mimetype.includes('image') ? 'image' : 'music';
            const key = `Mood/${filename}/${req.file.filename}`;

            if(Object.keys(oss).length < 5){
                fs.unlinkSync(localFile);
                res.json({
                    status: '101',
                    msg: '请填写正确的OSS'
                }); 
                return;
            }

            const OSS = require('ali-oss');
            const client = new OSS({
                region: oss.region,//填写你开通的oss
                accessKeyId: oss.accessKeyId,
                accessKeySecret: oss.accessKeySecret
            });
            const ali_oss = {
                bucket: oss.bucket,  // bucket name
                endPoint: oss.endPoint, // oss地址
            }

            // 阿里云 上传文件 
            co(function* () {
                client.useBucket(ali_oss.bucket);
                const result = yield client.put(key, localFile);

                // 自定义使用域名访问图片，（别忘记把域名解析至oss）
                const url = oss.domain ? `${oss.domain}/${result.name}` : result.url ;

                fs.unlinkSync(localFile);   // 上传之后删除本地文件
                res.json({
                    status:  100,
                    msg: '上传成功',
                    url: url
                }); 
            }).catch(function (err) {
                fs.unlinkSync(localFile);
                res.json({
                    status: '101',
                    msg: '上传失败',
                    error: JSON.stringify(err)
                }); 
            });
        }else{
            const filePath = (req.file.path).replace(/\\/g,"\/");
            res.json({
                status: 100, 
                msg:'上传成功', 
                url: `/${filePath}` 
            });
        }
    })

    // 删除文件
    router.post('/delete_file', async (req, res, next) => {
        const type = req.body.type;
        const localFile = `./${req.body.url}`;
        if(type == '阿里云OSS'){
            /**
             * 阿里云OSS
             */
            const result = await Info.find()
            const oss = result[0].upload_oss

            const OSS = require('ali-oss');
            const client = new OSS({
                region: oss.region,//填写你开通的oss
                accessKeyId: oss.accessKeyId,
                accessKeySecret: oss.accessKeySecret
            });
            const ali_oss = {
                bucket: oss.bucket,  // bucket name
                endPoint: oss.endPoint, // oss地址
            }
    
            //  文件路径
            const key = localFile.slice(localFile.indexOf('Mood'));

            // 删除文件
            co(function* () {
                client.useBucket(ali_oss.bucket);
                const result = yield client.delete(key);
                res.json({
                    status:  100,
                    msg: '删除成功'
                }); 
            })
        }else{
            fs.unlinkSync(localFile);
            res.json({
                status:  100,
                msg: '删除成功'
            }); 
        }
    })

    app.use('/admin/api', router)
}