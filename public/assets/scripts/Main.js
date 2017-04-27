const connection = new RTCMultiConnection();
const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { getParams } = require('./modules/_getParams');

connection.socketURL = '/';
connection.autoCloseEntireSession = false;
connection.socketMessageEvent = 'Main-RoomList'; // for setting params
connection.session = { data: true };
connection.enableLogs = false;
connection.extra = { uname: connection.userid };


connection.openOrJoin('Main' , function() { // callback show content
  var loading = document.getElementById('loading');
  var content = document.getElementById('content');

  loading.style.visibility = 'hidden';
  content.style.visibility = 'visible';
  content.className += ' animated';
  content.className += ' fadeIn';

  console.log('Connected to Server');
});

console.log('userid = ', connection.userid);

checkUser();
checkRoom();
getParams();

// ......................Handling Room-ID................
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

module.exports = {connection};
