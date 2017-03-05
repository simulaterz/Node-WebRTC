const express = require('express');
const http = require('http');
const path = require('path');

const publicPath = path.join(__dirname, '..', '/public');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

require('./modules/Signaling-Server')(server);
