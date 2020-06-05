module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Comment = require('../../models/comment')        
    const dateFormat = require('../../plugins/dateFormat')
    const requestResult = require('../../plugins/requestResult')

    // Get comment
    router.get('/comment', async (req, res) => {
        const p = req.query.page || 1;
        const s = req.query.count || 2;
        const result = await Promise.all([
            Comment.count(),
            Comment.find().limit(Number(s)).skip(Number(s)*(p-1))
        ])

        const data = result[1].reduce((total, item, index, arr) => {    
            item._doc['time'] = dateFormat(item.time)
            if(item.type === 1){
                item._doc['child'] = []
                total.push(item)
            }else{
                total.forEach(i => {
                    if(i.id === item.parent_id){
                        i._doc['child'].push(item)
                    }
                })
            }
            return total
        }, []).reverse()

        res.send(requestResult({total: result[0], data, page: p}))
    })

    app.use('/admin/api', router)
}