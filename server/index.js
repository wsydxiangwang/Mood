const express = require('express'); // 引入
const app = express(); // 实例化

app.use(require('cors')())
app.use(express.json())
    
app.use('/', express.static(__dirname + '/web'))
app.use('/admin', express.static(__dirname + '/admin'))



require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000!')
})

