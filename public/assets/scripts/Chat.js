var connection = new RTCMultiConnection('Main');
var { getParams } = require('./modules/_getParams');

connection.socketURL = '/';
connection.socketMessageEvent = 'ChatRoom';
connection.enableLogs = false;
connection.session = { audio: true, data: true };
connection.sdpConstraints.mandatory = { OfferToReceiveAudio: true, OfferToReceiveVideo: false };
connection.mediaConstraints = { audio: true, video: false };
connection.maxParticipantsAllowed = 4;
connection.autoCloseEntireSession = false;

// connection.extra = {
//   x: connection.userid
// };
//
// connection.onopen = function(event) {
//     connection.send({
//       name: connection.userid
//     });
// };
//
// connection.onmessage = function(event) {
//     alert(event.userid + ' said: ' + event.extra.x);
// };

connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function(event) {
  var li = document.createElement('li');
  var span = document.createElement('span');
  var div = document.createElement('div');

  li.id = event.streamid;
  span.className = "ion-mic-a icon__mic";
  div.className = "btn btn--online-list";

  span.innerHTML = '';
  div.innerHTML = event.userid;

  div.appendChild(span);
  li.appendChild(div);
  connection.audiosContainer.appendChild(li);
}

connection.onstreamended = function(event) {
  var mediaElement = document.getElementById(event.streamid);
  if(mediaElement) {
    mediaElement.parentNode.removeChild(mediaElement);
  }
};

getParams();

var roomid = window.params.roomid;

connection.checkPresence(roomid, function(isRoomExist, roomid) {
  if (isRoomExist === true) {
    connection.join(roomid);
  } else {
    connection.open(roomid, true);
  }
});
