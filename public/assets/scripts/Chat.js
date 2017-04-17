var connection = new RTCMultiConnection('Main');
var { getParams } = require('./modules/_getParams');
var moment = require('moment-timezone');

var time = function() {
  return moment().tz('Asia/Bangkok').format('LT');
}

connection.socketURL = '/';
connection.socketMessageEvent = 'ChatRoom';
connection.enableLogs = false;
connection.session = { audio: true, data: true };
connection.sdpConstraints.mandatory = { OfferToReceiveAudio: true, OfferToReceiveVideo: false };
connection.mediaConstraints = { audio: true, video: false };
connection.maxParticipantsAllowed = 4;

var num = Math.floor(Math.random() * (100 - 1 + 1)) + 1;

connection.extra = { uname: num };

connection.onopen = function(event) {
  connection.send({
    sender: "From Server",
    event: "User " + connection.extra.uname + " connected",
    time: time()
  });
};

connection.onleave = function(event) {
  if (event.extra.uname !== undefined) {
    appendDIV({
      sender: "From Server",
      text: "User " + event.extra.uname + " disconnected",
      time: time()
    });
  }
};

connection.onmessage = appendDIV;
connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function(event) {

  var mediaElement = document.createElement('li');
  var span = document.createElement('span');
  var div = document.createElement('div');

  mediaElement.id = event.streamid;
  span.className = "ion-mic-a icon__mic";
  span.id = "mute";
  div.className = "btn btn--online-list";
  span.innerHTML = '';

  div.innerHTML = event.extra.uname;

  div.appendChild(span);
  mediaElement.appendChild(div);
  connection.audiosContainer.appendChild(mediaElement);
};

connection.onstreamended = function(event) {
  var mediaElement = document.getElementById(event.streamid);
  if(mediaElement) {
    mediaElement.parentNode.removeChild(mediaElement);
  }
};

document.getElementById('input-text-chat').onkeyup = function(e) {
  if (e.keyCode != 13) return;
  this.value = this.value.replace(/^\s+|\s+$/g, '');
  if (!this.value.length) return;

  sendAndCreate(this.value);
  this.value = '';
};

document.getElementById('send-text').onclick = function() {
  var textfield = document.getElementById('input-text-chat');
  var text = textfield.value.replace(/^\s+|\s+$/g, '');
  if (!text.length) return;

  sendAndCreate(text);
  textfield.value = '';
};

function sendAndCreate(text) {
  connection.send({
    text: text,
    time: time()
  });
  appendDIV({
    text: text,
    time: time()
  });
};

var chatContainer = document.querySelector('.chat-box__content__chat');

function appendDIV(event) {

  var div = document.createElement('div');
  div.className = "btn btn--message";

  var headDiv = document.createElement('div');
  headDiv.className = "btn btn--message btn--message--title";

  var text = document.createElement('span');
  var time = document.createElement('span');
  time.className = "btn--message--title--time";

  if (event.data) {
    headDiv.innerHTML = event.data.sender || event.extra.uname;
    time.innerHTML = event.data.time;
    text.innerHTML = event.data.event || event.data.text || event;
    console.log(event);
  }
  else {
    headDiv.innerHTML = event.sender || connection.extra.uname;
    time.innerHTML = event.time;
    text.innerHTML = event.text;
    console.log(event);
  }

  headDiv.appendChild(time);
  div.appendChild(headDiv);
  div.appendChild(text);

  var list = document.createElement('li');
  list.appendChild(div);

  chatContainer.appendChild(list);
  div.tabIndex = 0;
  div.focus();
  document.getElementById('input-text-chat').focus();
}

getParams();

var roomid = window.params.roomid;

connection.checkPresence(roomid, function(isRoomExist, roomid) {
  if (isRoomExist === true) {
    connection.join(roomid);
  } else {
    connection.open(roomid, true);
  }
});
