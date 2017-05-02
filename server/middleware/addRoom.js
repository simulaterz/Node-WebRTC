var addRoom = (req, res, next) => {
  var user = req.user;
  var room = req.params.room;
  
  user.addFavRoom(room).then((user) => {
    req.user = user;
    next();
  });
}

module.exports = {addRoom};
