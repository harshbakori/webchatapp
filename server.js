var express = require('express')
var bodyparser = require('body-parser')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))

var dburl = 'mongodb+srv://user:user@cluster0.p3usy.mongodb.net/Cluster0?retryWrites=true&w=majority'

var Message = mongoose.model('Message', {
    name: String,
    messages: String
})

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

app.post('/messages', (req, res) => {
    var message = new Message(req.body)

    message.save((err) => {
        console.log("the error in mongoconnect = " + err)
        if (err) { sendStatus(500) } else {
            console.log(req.body)
            io.emit('messages', req.body)
            res.sendStatus(200)
        }
    })
})

io.on('connection', (socket) => {
    console.log("user connected to io")
})

mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    console.log("mongodb connection", err)
})

var server = http.listen(3000, () => {
    console.log("server is listnning to the port :", server.address().port)
})