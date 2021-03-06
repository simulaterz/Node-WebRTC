const connection = new RTCMultiConnection();
const $ = require('jquery');

const { authUser } = require('./modules/_authUser');
const { getParams } = require('./modules/_getParams');
const { clientToken} = require('./modules/_setLocalStorage');

const { handleRoomid } = require('./modules/_handleRoomid');
const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { renderMain } = require('./modules/_renderMain');
const { showLoadContent } = require('./modules/_showLoadContent');
const { logout } = require('./modules/_logout');

console.log(clientToken);
if (!clientToken) { alert("Please Login"); window.location = "/"; }

$.when(authUser(clientToken)).then((res) => {
  var userObject = res.user;
  console.log('res ******',res); // Checking RES

  // connection.iceServers = [];

  connection.socketURL = '/';
  connection.autoCloseEntireSession = false;
  connection.session = { data: true };
  connection.enableLogs = false;
  connection.userid = userObject.username;
  connection.extra = { uname: userObject.username };

  connection.openOrJoin('Main' , showLoadContent);

  checkUser();
  checkRoom();
  getParams();
  handleRoomid();
  renderMain();

  module.exports = { connection, userObject };
}).catch((e) => {
  alert("Login Status = Fail");
  localStorage.clear();
  window.location = "/";
});
