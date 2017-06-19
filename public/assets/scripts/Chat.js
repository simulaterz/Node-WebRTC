const connection = new RTCMultiConnection();
const $ = require('jquery');
const moment = require('moment-timezone');
const time = function() { return moment().tz('Asia/Bangkok').format('LT'); }

const { authUser } = require('./modules/_authUser');
const { getParams } = require('./modules/_getParams');
const { clientToken} = require('./modules/_setLocalStorage');

const { renderChatPage, renderChatBox } = require('./modules/_renderChat');
const { showUserOnline } = require('./modules/_showUserOnline');
const { showLoadContent } = require('./modules/_showLoadContent');
const { logout } = require('./modules/_logout');
const { addfavroom } = require('./modules/_handleFavroom');

console.log(clientToken);
if (!clientToken) { alert("Please Login"); window.location = "/"; }

$.when(authUser(clientToken)).then((res) => {
  var userObject = res.user;
  console.log('res ******',res); // Checking RES

  getParams();
  // connection.iceServers = [];

  var roomid = window.params.roomid;
  var roomname = window.params.roomname;
  if(!(roomid && roomname)) window.location = "/";

  connection.socketURL = '/';
  connection.autoCloseEntireSession = false;
  connection.session = {
    audio: true,
    data: true
  };
  connection.mediaConstraints = {
    audio: true,
    video: false
  };
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
  };
  connection.bandwidth = {
    audio: 128
  };
  connection.maxParticipantsAllowed = 4;
  connection.enableLogs = false;
  connection.extra = {
    uname: userObject.username,
    roomid: roomid,
    roomname: roomname
  };
  connection.onopen = function(event) { // fire when open connection
    document.getElementById('input-text-chat').disabled = false;
    document.getElementById('send-text').disabled = false;
  };
  connection.onleave = function(event) {
    if (event.extra.uname === undefined) return;
    renderChatBox({
      sender: "Server",
      text: "User " + event.extra.uname + " disconnected",
      time: time()
    });
  };
  connection.onmessage = renderChatBox;
  connection.checkPresence(roomid, function(isRoomExist, roomid) {
    if (isRoomExist) {
      console.log('JOIN');
      connection.join(roomid, showLoadContent);
      renderChatBox({
        sender: "Server",
        text: "Welcome to ChatRoom",
        time: time()
      });
    } else {
      console.log('OPEN');
      connection.open(roomid, showLoadContent);
      connection.becomePublicModerator();
      renderChatBox({
        sender: "Server",
        text: "Welcome to ChatRoom",
        time: time()
      });
    }
  });

  renderChatPage();
  showUserOnline();

  module.exports = { connection, userObject };
}).catch((e) => {
  alert("Login Status = Fail");
  localStorage.clear();
  window.location = "/";
});
