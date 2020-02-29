module.exports = app => {
    const express = require('express');
    const router = express.Router();

    const Envelope = require('../../models/envelope')

    router.post('/envelope', async (req, res) => {
        const data = await Envelope.create(req.body)
        console.log(res)
        res.send(data)
    })

    app.use('/admin/api', router)
}