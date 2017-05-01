var {User} = require('./../models/user');

var authUser = (req, res, next) => {
  var token = req.params.id;
  User.findByToken(token).then((user) => {
    if(!user) { return Promise.reject(); }
    req.user = user;
    next();
  }).catch((e) => {
    res.render('login');
  });
};

module.exports = {authUser}
