var checkRoomid = function() {
  var {connection} = require('./../Main');
  var roomid = connection.token();

  document.getElementById('open-public-room').onclick = function() {
    var roomname = document.getElementById('roomname').value;
    if(!roomname) {
      alert("Please typing room name")
      return;
    }
    location.href='/chat?roomid='+ roomid + '&roomname=' + roomname;
  };
};

function handleRoomid() {
  setTimeout(checkRoomid, 1);
}

module.exports = {handleRoomid};
