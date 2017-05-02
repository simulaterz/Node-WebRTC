const connection = new RTCMultiConnection();
const $ = require('jquery');

const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { getParams } = require('./modules/_getParams');
const { handleRoomid } = require('./modules/_handleRoomid');
const { clientToken} = require('./modules/_setLocalStorage');
const { authUser } = require('./modules/_authUser');

console.log(clientToken);
if (!clientToken) { alert("Please Login"); window.location = "/"; }

$.when(authUser(clientToken)).then((res) => {
  var userObject = res.user;
  console.log('res ******',res); // Checking RES

  connection.socketURL = '/';
  connection.autoCloseEntireSession = false;
  connection.socketMessageEvent = 'Main-RoomList'; // for setting params roomid
  connection.session = { data: true };
  connection.enableLogs = false;
  connection.userid = userObject.username; // seting form authUser = Math Random
  connection.extra = { uname: userObject.username };

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

  var favroomDiv = document.getElementById('favroomDiv');
  favroomDiv.innerHTML = '';
  var userSpan = document.getElementById('userSpan');
  userSpan.innerHTML = userObject.username;

  var li = document.createElement('li');
  var link = document.createElement('a');
  var span = document.createElement('span');
  var favroom = userObject.favroom;

  link.className = "btn btn--room btn--room--fav";
  link.href = "/chat?roomid=" + favroom;
  link.innerHTML = favroom;
  span.className = "ion-android-delete icon__del";
  span.innerHTML = '';
  link.appendChild(span);
  li.appendChild(link);

  favroomDiv.appendChild(li);
  // console.log('favroom', favroom);

  module.exports = {connection, userObject}; // export module to recall

}).catch((e) => {
  alert("Login Fail");
  localStorage.clear();
  window.location = "/";
});
