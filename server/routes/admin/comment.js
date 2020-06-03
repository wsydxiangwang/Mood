module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Comment = require('../../models/comment')        
    const dateFormat = require('../../plugins/dateFormat')
    const requestResult = require('../../plugins/requestResult')

    // Get comment
    router.get('/comment', async (req, res) => {
        const id = Number(req.params.id)
        const result = await Comment.find().count()

        console.log(result)

        // const data = result.reduce((total, item, index, arr) => {    
        //     item._doc['time'] = dateFormat(item.time)
        //     if(item.type === 1){
        //         item._doc['child'] = []
        //         total.push(item)
        //     }else{
        //         total.forEach(i => {
        //             if(i.id === item.parent_id){
        //                 i._doc['child'].push(item)
        //             }
        //         })
        //     }
        //     return total
        // }, []).reverse()
        
        // const total = result.length;
        
        // res.send(requestResult({data,total}))
    })

    app.use('/admin/api', router)
}