document.getElementById('open-public-room').onclick = function() {
  this.disabled = true;
  var isPublicModerator = true;
  location.href='/chat?roomid='+ document.getElementById('room-id').value;
};

var connection = new RTCMultiConnection('Main');
var { checkRoom } = require('./modules/_checkRoom');
var { getParams } = require('./modules/_getParams');

connection.autoCloseEntireSession = true;

connection.socketURL = '/';
connection.socketMessageEvent = 'Main-RoomList';
connection.session = { data: true };
connection.enableLogs = false;

connection.extra = { uname: connection.userid };

connection.onmessage(event);

connection.onleave = function(event) {
  var remoteUserId = event.userid;
  if (remoteUserId === 'Main') {
    console.log('Host leaved you');
  }
};

connection.openOrJoin();

var onlineListDiv = document.getElementById('online-list');

(function checkParticipants() {
  onlineListDiv.innerHTML = '';

  connection.getAllParticipants().forEach(function(participantId) {
    var user = connection.peers[participantId];
    var hisUID = user.extra.uname;
    var li = document.createElement('li');
    var link = document.createElement('a');
    var span = document.createElement('span');

    link.className = "btn btn--online";
    span.className = "ion-ios-chatbubble icon__status";
    link.innerHTML = hisUID;
    span.innerHTML = '';
    link.appendChild(span);
    li.appendChild(link);

    onlineListDiv.insertBefore(li, onlineListDiv.firstChild);
  });
  setTimeout(checkParticipants, 3000);
})();

console.log('userid = ', connection.userid);

checkRoom();

var publicRoomsDiv = document.getElementById('public-rooms');

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

module.exports = { connection };