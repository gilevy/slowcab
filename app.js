var express = require('express')
var app = express()

app.set('view engine', 'pug')
// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
  res.send('hello world')
})

app.get('/zinisplaybook', function (req, res) {
  res.render('zinisplaylist',{})
})



app.listen(3000, () => console.log('Example app listening on port 3000!'))
