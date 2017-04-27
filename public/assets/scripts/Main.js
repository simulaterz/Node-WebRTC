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
handleRoomid();

module.exports = {connection};
