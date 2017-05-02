var {User} = require('./../models/user');

var authUser = (req, res, next) => {
  var token = req.params.token;
  var room = req.params.room;
  User.findByToken(token).then((user) => {
    if(!user) {
      return Promise.reject();
    }
    req.user = user;
    next();

  }).catch((e) => {
    res.redirect('/');
  });
};

module.exports = {authUser}
