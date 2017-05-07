var addRoom = (req, res, next) => {
  var user = req.user;
  var roomid = req.params.roomid;
  var roomname = req.params.roomname;

  user.addFavRoom(roomname, roomid).then((user) => {
    req.user = user;
    next();
  });
}

module.exports = {addRoom};
