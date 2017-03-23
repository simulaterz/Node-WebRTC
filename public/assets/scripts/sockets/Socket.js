module.exports =  function Socket() {
  // ......................................................
  // .......................UI Code........................
  // ......................................................

  document.getElementById('open-public-room').onclick = function() {
    disableInputButtons();

    var isPublicModerator = true;
    connection.open(document.getElementById('room-id').value, isPublicModerator);

    showRoomURL(document.getElementById('room-id').value);
  };

  document.getElementById('open-private-room').onclick = function() {
    disableInputButtons();

    var isPublicModerator = false;
    connection.open(document.getElementById('room-id').value, isPublicModerator);
    document.getElementById('become-public-moderator').disabled = false;

    showRoomURL(document.getElementById('room-id').value);
  };

  document.getElementById('become-public-moderator').onclick = function() {
    this.disabled = true;

    connection.becomePublicModerator();
  };

  // ......................................................
  // ..................RTCMultiConnection Code.............
  // ......................................................

  var connection = new RTCMultiConnection();

  // by default, socket.io server is assumed to be deployed on your own URL
  connection.socketURL = '/';

  // comment-out below line if you do not have your own socket.io server
  // connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

  connection.socketMessageEvent = 'getPublicModerators-demo';

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
    }, 5000);
  };

  var publicRoomsDiv = document.getElementById('public-rooms');
  (function looper() {
    // connection.getPublicModerators(startsWith, callback)
    connection.getPublicModerators(function(array) {
      publicRoomsDiv.innerHTML = '';
      array.forEach(function(moderator) {
        // moderator.userid
        // moderator.extra
        if(moderator.userid == connection.userid) return; // if owner himself

        var li = document.createElement('li');
        li.innerHTML = '<b>' + moderator.userid + '</b>&nbsp;&nbsp;';

        var button = document.createElement('button');
        button.id = moderator.userid;
        button.onclick = function() {
          this.disabled = true;
          connection.join(this.id);
        };
        button.innerHTML = 'Join this room';
        li.appendChild(button);

        if(moderator.userid == connection.sessionid) {
          // if already connected with same moderator
          button.disabled = true;
        }

        publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
      });
      setTimeout(looper, 3000);
    });
  })();

  function disableInputButtons() {
    document.getElementById('open-public-room').disabled = true;
    document.getElementById('open-private-room').disabled = true;
    document.getElementById('room-id').disabled = true;
  }

  // ......................................................
  // ......................Handling Room-ID................
  // ......................................................

  function showRoomURL(roomid) {
    var roomHashURL = '#' + roomid;
    var roomQueryStringURL = '?roomid=' + roomid;

    var html = '<h2>Unique URL for your room:</h2><br>';

    html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
    html += '<br>';
    html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';

    var roomURLsDiv = document.getElementById('room-urls');
    roomURLsDiv.innerHTML = html;

    roomURLsDiv.style.display = 'block';
  }

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

    disableInputButtons();
  }
}
