require('./config/config');

// not use > validator
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const ejs = require('ejs');
const _ = require('lodash');

var cookieParser = require('cookie-parser');

const {ObjectID} = require('mongodb');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
// const {authenticate} = require('./middleware/authenticate');
const {authUser} = require('./middleware/authUser');
const {addRoom} = require('./middleware/addRoom');

const publicPath = path.join(__dirname, '..', '/public');
const viewPath = path.join(__dirname, '..', '/views');
const port = process.env.PORT;

const app = express();
const server = http.createServer(app);

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('views', viewPath);
app.set('view engine', 'ejs');

// mongoose zone // ------------------------------------------------------------
// app.post('/todos', (req, res) => {
//   var todo = new Todo({
//     text: req.body.text
//   });
//
//   todo.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });
//
// app.get('/todos', (req, res) => {
//   Todo.find().then((todos) => {
//     res.send({todos});
//   }, (e) => {
//
//   })
// });
//
// // GET /todos/12345
// app.get('/todos/:id', (req, res) => {
//   var id = req.params.id;
//   // res.send(req.params);
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   Todo.findById(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });
//
// app.delete('/todos/:id', (req, res) => {
//   var id = req.params.id;
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   Todo.findByIdAndRemove(id).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });
//
// app.patch('/todos/:id', (req, res) => {
//   var id = req.params.id;
//   var body = _.pick(req.body, ['text', 'completed']);
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send();
//   }
//
//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime();
//   } else {
//     body.completed = false;
//     body.completedAt = null;
//   }
//
//   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
//     if (!todo) {
//       return res.status(404).send();
//     }
//
//     res.send({todo});
//   }).catch((e) => {
//     res.status(400).send();
//   })
// });
//
// // POST /users
// app.post('/users', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   var user = new User(body);
//
//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).send(user);
//   }).catch((e) => {
//     res.status(400).send(e);
//   })
// });
//
// app.get('/users/me', authenticate, (req, res) => {
//   res.send(req.user); // user obj
// });
//
//
// //POST /users/login (email, password)
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//   User.findByCredentials(body.email, body.password).then((user) => {
//     // res.send(user);
//     user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     })
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });
// end mongoose zone // --------------------------------------------------------

// POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['username', 'password']);
  var user = new User(body);

  user.save().then((user) => {
    res.send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/', (req, res) => {
  res.render('login');
});

// POST /main
app.post('/main', (req, res) => {
  var body = _.pick(req.body, ['username', 'password']);
  User.findByCredentials(body.username, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.cookie( 'token', token, { maxAge: 1000 * 1 * 1, httpOnly: false }).render('main');
    })
  }).catch((e) => {
    res.redirect('/');
  });
});

// GET /main
app.get('/main', (req, res) => {
  res.render('main');
});

// GET /check/:token
app.get('/check/:token', authUser, (req, res) => {
  res.send({ user : req.user});
});

// GET /addroom/:token/:roomname/:roomid
app.get('/addroom/:token/:roomname/:roomid', authUser, addRoom, (req, res) => {
  res.send({ user : req.user});
});

app.get('/chat', (req, res) => {
  res.render('chat');
});

app.get('*', function(req, res) {
  res.redirect('/');
});

server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

require('./modules/Signaling-Server')(server);

module.exports = {app};
