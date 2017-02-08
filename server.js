const express = require('express');
const http = require('http');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

require('./Signaling-Server')(server);