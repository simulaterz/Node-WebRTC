const connection = new RTCMultiConnection();
const $ = require('jquery');
// const request = require('request'); // test

const { checkRoom } = require('./modules/_checkRoom');
const { checkUser } = require('./modules/_checkUser');
const { getParams } = require('./modules/_getParams');
const { handleRoomid } = require('./modules/_handleRoomid');
const { clientToken } = require('./modules/_setLocalStorage');

console.log(clientToken);

$.ajax({ url: `/check/${clientToken}`, type: "get", success: function(res) {
    console.log(res);
    // var num = Math.floor(Math.random() * 3) + 1;
    //
    connection.userid = res.user._id;
    connection.extra = { uname: res.user._id };
    console.log(connection.userid);
    openConnection();
  },
  error: function(err) { console.log('err'); }
});

if (!clientToken) {
  alert("Please Log in");
  window.location = "/";
}

connection.socketURL = '/';
connection.autoCloseEntireSession = false;
connection.socketMessageEvent = 'Main-RoomList'; // for setting params
connection.session = { data: true };
connection.enableLogs = false;

function openConnection() {
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
}

// console.log('userid = ', connection.userid);
checkUser();
checkRoom();
getParams();
handleRoomid();

module.exports = {connection};
