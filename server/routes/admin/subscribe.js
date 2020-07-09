module.exports = (app, plugin, model) => {
    const express = require('express');
    const router = express.Router();
    
    let {Subscribe} = model
    let {dateFormat} = plugin        

    router.get('/subscribe', async (req, res) => {
        const data = await Subscribe.find()        
        data.forEach(item => item._doc['time'] = dateFormat(time(item.time)) )
        res.send(data)
    })

    router.delete('/subscribe/:id', async (req, res) => {
        await Subscribe.findByIdAndDelete(req.params.id, req.body)
        res.send({success: true})
    })

    function time(data){
        const date = new Date(data);
        const opt = {
            "Y": date.getFullYear().toString(),     
            "M": (date.getMonth() + 1).toString(),  
            "D": date.getDate().toString(),         
            "H": date.getHours().toString(),        
            "m": date.getMinutes().toString(),      
        }
        for(let i in opt){
            opt[i] = opt[i].length == 1 ? opt[i].padStart(2, "0") : opt[i]
        }
        return `${opt.Y}/${opt.M}/${opt.D} ${opt.H}:${opt.m}`
    }

    app.use('/admin/api', router)
}