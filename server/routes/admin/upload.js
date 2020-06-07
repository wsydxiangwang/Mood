module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const multer  = require('multer')
    const fs = require('fs');
    const co = require('co');

    // /**
    //  * 阿里云OSS
    //  */
    // const OSS = require('ali-oss');
    // const client = new OSS({
    //     region: 'oss-cn-shenzhen',//填写你开通的oss
    //     accessKeyId: 'LTAI4G3Je77pHXwGZoTriHL6',
    //     accessKeySecret: 'JfwnNIkcaFIRuZIFw5dtbtrprelUrO'
    // });
    // const ali_oss = {
    //     bucket: 'img-wsydxiangwang',  // bucket name
    //     endPoint: 'oss-cn-shenzhen.aliyuncs.com', // oss地址
    // }

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

        console.log(req.file)

        res.json({status:'100',msg:'上传成功',imageUrl: '/'+req.file.path }); 

        //  文件路径
        // const filePath = './' + req.file.path;  
        


        // // 图片重命名
        // fs.rename(filePath, fileName, (err) => {
        //     if (err) {
        //         res.json(JSON.stringify({status:'102',msg:'文件写入失败'}));   
        //     }else{
        //         const localFile = `./${fileName}`;
        //         const key = `Mood/image/${fileName}`;

        //         // 阿里云 上传文件 
        //         co(function* () {
        //             client.useBucket(ali_oss.bucket);
        //             const result = yield client.put(key, localFile);
        //             const imageSrc = `https://image.raindays.cn/Mood/${result.name}`;
        //             fs.unlinkSync(localFile);
        //             res.json({status:'100',msg:'上传成功',imageUrl:imageSrc}); 
        //         }).catch(function (err) {
        //             // 上传之后删除本地文件
        //             fs.unlinkSync(localFile);
        //             res.json({status:'101',msg:'上传失败',error:JSON.stringify(err)}); 
        //         });
        //     }
        // });
    })

    app.use('/admin/api', router)
}