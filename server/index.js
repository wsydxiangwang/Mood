const express = require('express');
const history = require('connect-history-api-fallback');
const app = express();

app.use(history({
    index: '/admin/index.html'
}))

app.use(require('cors')())
app.use(express.json())

app.use('/admin', express.static(__dirname + '/admin'))

require('./plugins/db')(app)
require('./routes/admin')(app)
require('./routes/web')(app)

app.listen(3000, () => {
    console.log('http://localhost:3000!')
})