const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const signal = require('./Signaling-Server');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

io.on('connection', (socket) => {
    socket.on('ready', (req) => {
        socket.join(req.chat_room);
        socket.join(req.signal_room);
        // socket.broadcast.to(req.chat_room).emit('announce', {
        //     message: `New client in the ${req.chat_room} room.`
        // });
    });

    socket.on('send', (req) => {
        io.to(req.room).emit('message', {
            message: req.message,
            author: req.author
        });
    });

    socket.on('signal', (req) => {
        socket.broadcast.to(req.room).emit('signaling_message', {
            "type": req.type,
            "message": req.message
        });
    })
});

// app.get('/', (req, res) => {
//     res.render('rtc.ejs');
// });
//
// signal(server);


server.listen(port, () => {
    console.log('Server started');
});

// Before Test