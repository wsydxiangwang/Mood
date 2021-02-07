module.exports = (app, plugin, model) => {
    const express = require('express')
    const router = express.Router()
    
    let { Subscribe } = model
    let { GetPage, RequestResult } = plugin

    router.get('/subscribe', async (req, res) => {
        const data = await GetPage(Subscribe, req.query.page)
        res.send(RequestResult(null, data))
    })

    router.delete('/subscribe/:id', async (req, res) => {
        Subscribe.findByIdAndDelete( req.params.id, (err, doc) => {
            res.send(RequestResult(err, doc))
        })
    })

    app.use('/admin/api', router)
}