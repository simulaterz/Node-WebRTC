// var Socket = require('./sockets/Socket');
// var Script = require('./modules/_script')();
// Socket();

var $ = require('jquery');

document.getElementById('open-public-room').onclick = function() {
  this.disabled = true;
  var isPublicModerator = true;
  connection.open(document.getElementById('room-id').value, isPublicModerator);
};

/* RTCMultiConnection */
var connection = new RTCMultiConnection();

connection.socketURL = '/';

connection.socketMessageEvent = 'RTCProject';

connection.session = {
  audio: true,
  video: true
};

connection.sdpConstraints.mandatory = {
  OfferToReceiveAudio: true,
  OfferToReceiveVideo: true
};

connection.videosContainer = document.getElementById('videos-container');
connection.onstream = function(event) {
  connection.videosContainer.appendChild(event.mediaElement);
  event.mediaElement.play();
  setTimeout(function() {
    event.mediaElement.play();
    alert('alertMedia 5 sec');
  }, 5000);
};

console.log('connection.userid = ' + connection.userid);

var publicRoomsDiv = document.getElementById('public-rooms');

(function checkRoom() {
  connection.getPublicModerators(function(array) {

    publicRoomsDiv.innerHTML = '';
    array.forEach(function(moderator) {

      console.log('getPublicModerators is running');
      console.log('moderator.userid = ' + moderator.userid);
      console.log('connection.userid = ' + connection.userid);

      if(moderator.userid == connection.userid) return; // if owner himself

      var li = document.createElement('li');

      // li.innerHTML = '<b>' + moderator.userid + '</b>&nbsp;&nbsp;';

      var button = document.createElement('a');
      button.href = "/chat?roomid=" + moderator.userid;
      button.id = moderator.userid;
      button.className = "btn btn--room btn--room--main";

      button.click = function() {
        // this.disabled = true;
        connection.join(this.id);
      };

      button.innerHTML = moderator.userid;
      li.appendChild(button);

      // if(moderator.userid == connection.sessionid) {
      //   // if already connected with same moderator
      //   button.disabled = true;
      // }

      publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
    });
    setTimeout(checkRoom, 3000);
  });
})();

// ......................................................
// ......................Handling Room-ID................
// ......................................................

// function showRoomURL(roomid) {
//   var roomHashURL = '#' + roomid;
//   var roomQueryStringURL = '?roomid=' + roomid;
//
//   var html = '<h2>Unique URL for your room:</h2><br>';
//
//   html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
//   html += '<br>';
//   html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
//
//   var roomURLsDiv = document.getElementById('room-urls');
//   roomURLsDiv.innerHTML = html;
//
//   roomURLsDiv.style.display = 'block';
// }

(function() {
  var params = {},
  r = /([^&=]+)=?([^&]*)/g;

  function d(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  }

  var match, search = window.location.search;
  while (match = r.exec(search.substring(1)))
  params[d(match[1])] = d(match[2]);
  window.params = params;
})();

var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
  roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
  roomid = connection.token();
}

console.log("roomid = " + roomid);

document.getElementById('room-id').value = roomid;
document.getElementById('room-id').onkeyup = function() {
  localStorage.setItem(connection.socketMessageEvent, this.value);
};

var hashString = location.hash.replace('#', '');
if(hashString.length && hashString.indexOf('comment-') == 0) {
  hashString = '';
}

var roomid = params.roomid;
if(!roomid && hashString.length) {
  roomid = hashString;
}

if(roomid && roomid.length) {
  document.getElementById('room-id').value = roomid;
  localStorage.setItem(connection.socketMessageEvent, roomid);

  // auto-join-room
  (function reCheckRoomPresence() {
    connection.checkPresence(roomid, function(isRoomExists) {
      if(isRoomExists) {
        connection.join(roomid);
        return;
      }

      setTimeout(reCheckRoomPresence, 5000);
    });
  })();

  // disableInputButtons();
}
