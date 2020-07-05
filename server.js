var express = require('express')
var bodyparser = require('body-parser')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyparser.json())

app.use(bodyparser.urlencoded({ extended: true }))

var messages = [{
    name: "tim",
    messages: "hi"
}, {
    name: "jorden",
    messages: "hello"
}]

app.get('/messages', (req, res) => {
    res.send(messages)
})

app.post('/messages', (req, res) => {
    console.log(req.body)
    messages.push(req.body)
    io.emit('messages', req.body)
    res.sendStatus(200)

})

io.on('connection', (socket) => {
    console.log("user connected")
})


var server = http.listen(3000, () => {
    console.log("server is listnning to the port :", server.address().port)
})