var checkRoomid = function() {
  var {connection} = require('./../Main');
  var roomid = connection.token();

  // document.getElementById('roomname').onkeyup = function() { // insert roomid to localStorage
  //   localStorage.setItem("roomname", this.value);
  // };

  document.getElementById('open-public-room').onclick = function() {
    var roomname = document.getElementById('roomname').value;
    if(!roomname) {
      alert("Please typing room name")
      return;
    }
    location.href='/chat?roomid='+ roomid + '&roomname=' + roomname;
  };

  // if (localStorage.getItem(connection.socketMessageEvent)) { // check room name in localStorage
  //   roomid = localStorage.getItem(connection.socketMessageEvent);
  // } else {
  //   roomid = connection.token();
  // }
  //
  // document.getElementById('room-id').value = roomid; // setting roomid to input
  //
  // document.getElementById('room-id').onkeyup = function() { // insert roomid to localStorage
  //   localStorage.setItem(connection.socketMessageEvent, this.value);
  // };
  //
  // document.getElementById('open-public-room').onclick = function() {
  //   this.disabled = true;
  //   var isPublicModerator = true;
  //   location.href='/chat?roomid='+ document.getElementById('room-id').value;
  // };
};

function handleRoomid() {
  setTimeout(checkRoomid, 1);
}

module.exports = {handleRoomid};
