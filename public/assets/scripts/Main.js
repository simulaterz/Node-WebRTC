const connection = new RTCMultiConnection();

const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { getParams } = require('./modules/_getParams');
const { handleRoomid } = require('./modules/_handleRoomid');

connection.socketURL = '/';
connection.autoCloseEntireSession = false;
connection.socketMessageEvent = 'Main-RoomList'; // for setting params
connection.session = { data: true };
connection.enableLogs = false;
connection.extra = { uname: connection.userid };


connection.openOrJoin('Main' , function() { // callback show content
  var loading = document.getElementById('loading');
  var content = document.getElementById('content');

  loading.className += ' animated';
  loading.className += ' fadeOut';
  
  content.className += ' animated';
  content.className += ' fadeIn';
  content.style.visibility = 'visible';

  console.log('Connected to Server');
});

console.log('userid = ', connection.userid);

checkUser();
checkRoom();
getParams();
handleRoomid();

module.exports = {connection};
