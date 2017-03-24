const express = require('express');
const http = require('http');
const path = require('path');
const ejs = require('ejs');

const publicPath = path.join(__dirname, '..', '/public');
const viewPath = path.join(__dirname, '..', '/views');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));

app.set('views', viewPath);
app.set('view engine', 'ejs');

app.get('/a', (req, res) => {
  res.render('index');
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

require('./modules/Signaling-Server')(server);
