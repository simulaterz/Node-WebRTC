const connection = new RTCMultiConnection('Main');
const $ = require('jquery');
const moment = require('moment-timezone');
const time = function() { return moment().tz('Asia/Bangkok').format('LT'); }

const { authUser } = require('./modules/_authUser');
const { clientToken} = require('./modules/_setLocalStorage');
const { getParams } = require('./modules/_getParams');
const { renderChatPage, renderChatZone } = require('./modules/_renderChat');

console.log(clientToken);
if (!clientToken) { alert("Please Login"); window.location = "/"; }

$.when(authUser(clientToken)).then((res) => {
  var userObject = res.user;
  console.log('res ******',res); // Checking RES
  getParams(); // GET params
  var roomid = window.params.roomid;
  var roomname = window.params.roomname;

  connection.socketURL = '/';
  connection.autoCloseEntireSession = false;
  connection.socketMessageEvent = 'ChatRoom';
  connection.session = { audio: true, data: true };
  connection.mediaConstraints = { audio: true, video: false };
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
  };
  connection.maxParticipantsAllowed = 4;
  connection.enableLogs = false;
  connection.extra = {
    uname: userObject.username,
    roomid: roomid,
    roomname: roomname
  };

  // who open connection will "send" this
  connection.onopen = function(event) {
    connection.send({
      sender: "From Server",
      text: "User " + connection.extra.uname + " connected",
      time: time()
    });
  };

  connection.onleave = function(event) {
    if (event.extra.uname === undefined) return;
    renderChatZone({
      sender: "From Server",
      text: "User " + event.extra.uname + " disconnected",
      time: time()
    });
  };

  connection.onmessage = renderChatZone;
  connection.audiosContainer = document.getElementById('audios-container');

  // Add User online chat
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
      sender: connection.extra.uname,
      text: text,
      time: time()
    });
    renderChatZone({
      sender: connection.extra.uname,
      text: text,
      time: time()
    });
  };

  function showContent() {
    var loading = document.getElementById('loading');
    var content = document.getElementById('content');

    loading.className += ' animated';
    loading.className += ' fadeOut';
    content.className += ' animated';
    content.className += ' fadeIn';
    content.style.visibility = 'visible';

    console.log('Connected to Server');
  };

  connection.checkPresence(roomid, function(isRoomExist, roomid) {
    if (isRoomExist === true) {
      connection.join(roomid, showContent());
    } else {
      connection.open(roomid, true);
      showContent();
    }
  });

  renderChatPage();

  module.exports = { connection, userObject }; // export module to recall
}).catch((e) => {
  alert("Login Status = Fail");
  localStorage.clear();
  window.location = "/";
});
