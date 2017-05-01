const connection = new RTCMultiConnection();
const $ = require('jquery');

const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { getParams } = require('./modules/_getParams');
const { handleRoomid } = require('./modules/_handleRoomid');
const { clientToken } = require('./modules/_setLocalStorage');
const { authUser } = require('./modules/_authUser');

console.log(clientToken);
if (!clientToken) { alert("Please Login"); window.location = "/"; }

$.when(authUser(clientToken)).then((res) => {
  console.log('res ******',res); // Checking RES

  connection.socketURL = '/';
  connection.autoCloseEntireSession = false;
  connection.socketMessageEvent = 'Main-RoomList'; // for setting params roomid
  connection.session = { data: true };
  connection.enableLogs = false;
  connection.userid = res.user._id;
  connection.extra = { uname: res.user._id };

  connection.openOrJoin('Main' , function() { // Callback to show content
    var loading = document.getElementById('loading');
    var content = document.getElementById('content');

    loading.className += ' animated';
    loading.className += ' fadeOut';
    content.className += ' animated';
    content.className += ' fadeIn';
    content.style.visibility = 'visible';

    console.log('Connected to Server');
  });

  checkUser();
  checkRoom();
  getParams();
  handleRoomid();
  // renderPage();

  module.exports = {connection}; // export module to recall

}).catch((e) => {
  alert("Login Fail");
  window.location = "/";
});
