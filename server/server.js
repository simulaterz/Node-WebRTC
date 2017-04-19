const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const publicPath = path.join(__dirname, '..', '/public');
const viewPath = path.join(__dirname, '..', '/views');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));
app.use(bodyParser.json());

app.set('views', viewPath);
app.set('view engine', 'ejs');

// mongoose zone //

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {

  })
});

// GET /todos/12345
app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  // res.send(req.params);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

// end mongoose zone //

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/main', (req, res) => {
  res.render('main');
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

require('./modules/Signaling-Server')(server);

module.exports = {app};
