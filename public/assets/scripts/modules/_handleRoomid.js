var checkRoomid = function() {
  var {connection} = require('./../Main');
  var roomid = '';

  if (localStorage.getItem(connection.socketMessageEvent)) { // check room name in localStorage
    roomid = localStorage.getItem(connection.socketMessageEvent);
  } else { roomid = connection.token(); }
  document.getElementById('room-id').value = roomid; // setting roomid to input
  document.getElementById('room-id').onkeyup = function() { // insert roomid to localStorage
    localStorage.setItem(connection.socketMessageEvent, this.value);
  };

  document.getElementById('open-public-room').onclick = function() {
    this.disabled = true;
    var isPublicModerator = true;
    location.href='/chat?roomid='+ document.getElementById('room-id').value;
  };
};

function handleRoomid() {
  setTimeout(checkRoomid, 1);
}

module.exports = {handleRoomid};
