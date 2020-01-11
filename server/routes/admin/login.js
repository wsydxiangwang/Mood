module.exports = app => {
    const express = require('express');
    const router = express.Router();
    const jwt = require('jsonwebtoken');

    router.post('/login', async (req, res) => {
        console.log('2')
        // const data = await User.find().
        res.send(data)
    })
    

    app.use('/admin/api', router)
}