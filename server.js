const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

io.on('connection', (socket) => {
    socket.on('ready', (req) => {
        roomName = req;
        socket.join(roomName);
        socket.broadcast.to(roomName).emit('announce', {
            message: `New client in the ${roomName} room.`
        });
    });

    socket.on('send', (req) => {
        io.to(req.room).emit('message', {
            message: req.message,
            author: req.author
        });
    });
});

server.listen(3000, () => {
    console.log('Server started');
});