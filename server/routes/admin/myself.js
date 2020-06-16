module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Myself = require('../../models/myself')
    const requestResult = require('../../plugins/requestResult')

    router.post('/myself', async (req, res) => {
        if(req.body._id){
            const result = await Myself.findByIdAndUpdate(
                req.body._id, 
                req.body, 
                (err, doc) => {
                    return doc
                })
            res.send(requestResult(result))
        }else{
            const result = await Myself.create(req.body)
            res.send(requestResult(result))
        }
    })

    router.get('/myself', async (req, res) => {
        const result = await Myself.findOne()
        res.send(requestResult(result))
    })

    app.use('/admin/api', router)
}