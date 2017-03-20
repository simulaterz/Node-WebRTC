/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function Socket() {
  var connection = new RTCMultiConnection();
  var sessionsList = document.getElementById('sessions-list');
  connection.onNewSession = function (session) {
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + session.extra.username + '</td>';
    var td = document.createElement('td');
    var button = document.createElement('button');
    button.innerHTML = 'join';
    td.appendChild(button);
    tr.appendChild(td);
    sessionsList.insertBefore(tr, sessionsList.firstChild);
    button.onclick = function () {
      if (!window.username) window.username = prompt('Please enter your username') || 'Anonymous';
      connection.extra = {
        username: window.username
      };
      session.join();
      document.getElementById('start-new-session').disabled = true;
      sessionsList.style.display = 'none';
    };
  };
  // check if user is ejected
  // clear rooms-list if user is ejected
  connection.onSessionClosed = function (event) {
    if (event.isEjected) {
      sessionsList.innerHTML = '';
      sessionsList.style.display = 'block';
    }
  };
  document.getElementById('start-new-session').onclick = function () {
    if (!window.username) window.username = prompt('Please enter your username') || 'Anonymous';
    connection.extra = {
      username: window.username
    };
    connection.interval = 1000;
    connection.sessionid = window.username;
    connection.open();
    document.getElementById('start-new-session').disabled = true;
    sessionsList.style.display = 'none';
  };
  connection.onstream = function (stream) {
    if (stream.type === 'local') {
      var video = getVideo(stream, {
        username: 'TEST' || window.username
      });
      document.getElementById('local-video-container').appendChild(video);
    }
    if (stream.type === 'remote') {
      var video = getVideo(stream, stream.extra);
      var remoteVideosContainer = document.getElementById('remote-videos-container');
      remoteVideosContainer.appendChild(video, remoteVideosContainer.firstChild);
    }
    stream.mediaElement.width = innerWidth / 3.4;
  };
  connection.onstreamended = function (e) {
    if (e.mediaElement && e.mediaElement.parentNode && e.mediaElement.parentNode.parentNode) {
      e.mediaElement.parentNode.parentNode.removeChild(e.mediaElement.parentNode);
    }
  };
  function getVideo(stream, extra) {
    var div = document.createElement('div');
    div.className = 'video-container';
    div.id = stream.userid || 'self';
    if (stream.type === 'remote') {
      if (connection.isInitiator) {
        var eject = document.createElement('button');
        eject.className = 'eject';
        eject.title = 'Eject this User';
        eject.onclick = function () {
          // eject a specific user
          connection.eject(this.parentNode.id);
          this.parentNode.style.display = 'none';
        };
        div.appendChild(eject);
      }
    }
    div.appendChild(stream.mediaElement);
    if (extra) {
      var h2 = document.createElement('h2');
      h2.innerHTML = extra.username;
      div.appendChild(h2);
    }
    return div;
  }
  connection.connect();
};

// module.exports =  function Socket() {
//   // ......................................................
//   // .......................UI Code........................
//   // ......................................................
//   document.getElementById('open-room').onclick = function () {
//     disableInputButtons();
//     connection.open(document.getElementById('room-id').value, function () {
//       showRoomURL(connection.sessionid);
//     });
//   };
//   document.getElementById('join-room').onclick = function () {
//     disableInputButtons();
//     connection.join(document.getElementById('room-id').value);
//   };
//   document.getElementById('open-or-join-room').onclick = function () {
//     disableInputButtons();
//     connection.openOrJoin(document.getElementById('room-id').value, function (isRoomExists, roomid) {
//       if (!isRoomExists) {
//         showRoomURL(roomid);
//       }
//     });
//   };
//   document.getElementById('btn-leave-room').onclick = function () {
//     this.disabled = true;
//     if (connection.isInitiator) {
//       // use this method if you did NOT set "autoCloseEntireSession===true"
//       // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
//       connection.closeEntireSession(function () {
//         document.querySelector('h1').innerHTML = 'Entire session has been closed.';
//       });
//     }
//     else {
//       connection.leave();
//     }
//   };
//   // ......................................................
//   // ................FileSharing/TextChat Code.............
//   // ......................................................
//   document.getElementById('share-file').onclick = function () {
//     var fileSelector = new FileSelector();
//     fileSelector.selectSingleFile(function (file) {
//       connection.send(file);
//     });
//   };
//   document.getElementById('input-text-chat').onkeyup = function (e) {
//     if (e.keyCode != 13) return;
//     // removing trailing/leading whitespace
//     this.value = this.value.replace(/^\s+|\s+$/g, '');
//     if (!this.value.length) return;
//     connection.send(this.value);
//     appendDIV(this.value);
//     this.value = '';
//   };
//   var chatContainer = document.querySelector('.chat-output');
//   function appendDIV(event) {
//     var div = document.createElement('div');
//     div.innerHTML = event.data || event;
//     chatContainer.insertBefore(div, chatContainer.firstChild);
//     div.tabIndex = 0;
//     div.focus();
//     document.getElementById('input-text-chat').focus();
//   }
//   // ......................................................
//   // ..................RTCMultiConnection Code.............
//   // ......................................................
//   var connection = new RTCMultiConnection();
//
//   // external ice server
//   // require('./IceServer');
//   // by default, socket.io server is assumed to be deployed on your own URL
//   connection.socketURL = '/';
//   connection.getExternalIceServers = false;
//   connection.iceServers = [];
//
//   connection.socketMessageEvent = 'audio-video-file-chat-demo';
//   connection.enableFileSharing = true; // by default, it is "false".
//   connection.session = {
//     audio: true,
//     video: true,
//     data: true
//   };
//   connection.sdpConstraints.mandatory = {
//     OfferToReceiveAudio: true,
//     OfferToReceiveVideo: true
//   };
//   connection.videosContainer = document.getElementById('videos-container');
//   connection.onstream = function (event) {
//     var width = parseInt(connection.videosContainer.clientWidth / 5) - 20;
//     var mediaElement = getMediaElement(event.mediaElement, {
//       title: event.userid,
//       buttons: ['mute-audio'],
//       width: width,
//       showOnMouseEnter: false
//     });
//     connection.videosContainer.appendChild(mediaElement);
//     setTimeout(function () {
//       mediaElement.media.play();
//     }, 5000);
//     mediaElement.id = event.streamid;
//   };
//   connection.onstreamended = function (event) {
//     var mediaElement = document.getElementById(event.streamid);
//     if (mediaElement) {
//       mediaElement.parentNode.removeChild(mediaElement);
//     }
//   };
//   connection.onmessage = appendDIV;
//   connection.filesContainer = document.getElementById('file-container');
//   connection.onopen = function () {
//     document.getElementById('share-file').disabled = false;
//     document.getElementById('input-text-chat').disabled = false;
//     document.getElementById('btn-leave-room').disabled = false;
//     document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
//   };
//   connection.onclose = function () {
//     if (connection.getAllParticipants().length) {
//       document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
//     }
//     else {
//       document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left.';
//     }
//   };
//   connection.onEntireSessionClosed = function (event) {
//     document.getElementById('share-file').disabled = true;
//     document.getElementById('input-text-chat').disabled = true;
//     document.getElementById('btn-leave-room').disabled = true;
//     document.getElementById('open-or-join-room').disabled = false;
//     document.getElementById('open-room').disabled = false;
//     document.getElementById('join-room').disabled = false;
//     document.getElementById('room-id').disabled = false;
//     connection.attachStreams.forEach(function (stream) {
//       stream.stop();
//     });
//     // don't display alert for moderator
//     if (connection.userid === event.userid) return;
//     document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
//   };
//   connection.onUserIdAlreadyTaken = function (useridAlreadyTaken, yourNewUserId) {
//     // seems room is already opened
//     connection.join(useridAlreadyTaken);
//   };
//   function disableInputButtons() {
//     document.getElementById('open-or-join-room').disabled = true;
//     document.getElementById('open-room').disabled = true;
//     document.getElementById('join-room').disabled = true;
//     document.getElementById('room-id').disabled = true;
//   }
//   // ......................................................
//   // ......................Handling Room-ID................
//   // ......................................................
//   function showRoomURL(roomid) {
//     var roomHashURL = '#' + roomid;
//     var roomQueryStringURL = '?roomid=' + roomid;
//     var html = '<h2>Unique URL for your room:</h2><br>';
//     html += 'Hash URL: <a href="' + roomHashURL + '" target="_blank">' + roomHashURL + '</a>';
//     html += '<br>';
//     html += 'QueryString URL: <a href="' + roomQueryStringURL + '" target="_blank">' + roomQueryStringURL + '</a>';
//     var roomURLsDiv = document.getElementById('room-urls');
//     roomURLsDiv.innerHTML = html;
//     roomURLsDiv.style.display = 'block';
//   }
//   (function () {
//     var params = {},
//     r = /([^&=]+)=?([^&]*)/g;
//
//     function d(s) {
//       return decodeURIComponent(s.replace(/\+/g, ' '));
//     }
//
//     var match, search = window.location.search;
//     while (match = r.exec(search.substring(1)))
//     params[d(match[1])] = d(match[2]);
//     window.params = params;
//   })();
//   var roomid = '';
//   if (localStorage.getItem(connection.socketMessageEvent)) {
//     roomid = localStorage.getItem(connection.socketMessageEvent);
//   } else {
//     roomid = connection.token();
//   }
//   document.getElementById('room-id').value = roomid;
//   document.getElementById('room-id').onkeyup = function () {
//     localStorage.setItem(connection.socketMessageEvent, this.value);
//   };
//   var hashString = location.hash.replace('#', '');
//   if (hashString.length && hashString.indexOf('comment-') == 0) {
//     hashString = '';
//   }
//   var roomid = params.roomid;
//   if (!roomid && hashString.length) {
//     roomid = hashString;
//   }
//   if (roomid && roomid.length) {
//     document.getElementById('room-id').value = roomid;
//     localStorage.setItem(connection.socketMessageEvent, roomid);
//     // auto-join-room
//     (function reCheckRoomPresence() {
//       connection.checkPresence(roomid, function (isRoomExists) {
//         if (isRoomExists) {
//           connection.join(roomid);
//           return;
//         }
//         setTimeout(reCheckRoomPresence, 5000);
//       });
//     })();
//     disableInputButtons();
//   }
// }

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Socket = __webpack_require__(0);

var socket = new Socket();

/***/ })
/******/ ]);