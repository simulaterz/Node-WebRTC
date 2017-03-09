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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Socket;
function Socket() {
  // ......................................................
  // .......................UI Code........................
  // ......................................................
  document.getElementById('open-room').onclick = function () {
    disableInputButtons();
    connection.open(document.getElementById('room-id').value, function () {
      showRoomURL(connection.sessionid);
    });
  };
  document.getElementById('join-room').onclick = function () {
    disableInputButtons();
    connection.join(document.getElementById('room-id').value);
  };
  document.getElementById('open-or-join-room').onclick = function () {
    disableInputButtons();
    connection.openOrJoin(document.getElementById('room-id').value, function (isRoomExists, roomid) {
      if (!isRoomExists) {
        showRoomURL(roomid);
      }
    });
  };
  document.getElementById('btn-leave-room').onclick = function () {
    this.disabled = true;
    if (connection.isInitiator) {
      // use this method if you did NOT set "autoCloseEntireSession===true"
      // for more info: https://github.com/muaz-khan/RTCMultiConnection#closeentiresession
      connection.closeEntireSession(function () {
        document.querySelector('h1').innerHTML = 'Entire session has been closed.';
      });
    } else {
      connection.leave();
    }
  };
  // ......................................................
  // ................FileSharing/TextChat Code.............
  // ......................................................
  document.getElementById('share-file').onclick = function () {
    var fileSelector = new FileSelector();
    fileSelector.selectSingleFile(function (file) {
      connection.send(file);
    });
  };
  document.getElementById('input-text-chat').onkeyup = function (e) {
    if (e.keyCode != 13) return;
    // removing trailing/leading whitespace
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length) return;
    connection.send(this.value);
    appendDIV(this.value);
    this.value = '';
  };
  var chatContainer = document.querySelector('.chat-output');
  function appendDIV(event) {
    var div = document.createElement('div');
    div.innerHTML = event.data || event;
    chatContainer.insertBefore(div, chatContainer.firstChild);
    div.tabIndex = 0;
    div.focus();
    document.getElementById('input-text-chat').focus();
  }
  // ......................................................
  // ..................RTCMultiConnection Code.............
  // ......................................................
  var connection = new RTCMultiConnection();

  __webpack_require__(1);
  // by default, socket.io server is assumed to be deployed on your own URL
  connection.socketURL = '/';

  connection.socketMessageEvent = 'audio-video-file-chat-demo';
  connection.enableFileSharing = true; // by default, it is "false".
  connection.session = {
    audio: true,
    video: true,
    data: true
  };
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true
  };
  connection.videosContainer = document.getElementById('videos-container');
  connection.onstream = function (event) {
    var width = parseInt(connection.videosContainer.clientWidth / 5) - 20;
    var mediaElement = getMediaElement(event.mediaElement, {
      title: event.userid,
      buttons: ['mute-audio'],
      width: width,
      showOnMouseEnter: false
    });
    connection.videosContainer.appendChild(mediaElement);
    setTimeout(function () {
      mediaElement.media.play();
    }, 5000);
    mediaElement.id = event.streamid;
  };
  connection.onstreamended = function (event) {
    var mediaElement = document.getElementById(event.streamid);
    if (mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
    }
  };
  connection.onmessage = appendDIV;
  connection.filesContainer = document.getElementById('file-container');
  connection.onopen = function () {
    document.getElementById('share-file').disabled = false;
    document.getElementById('input-text-chat').disabled = false;
    document.getElementById('btn-leave-room').disabled = false;
    document.querySelector('h1').innerHTML = 'You are connected with: ' + connection.getAllParticipants().join(', ');
  };
  connection.onclose = function () {
    if (connection.getAllParticipants().length) {
      document.querySelector('h1').innerHTML = 'You are still connected with: ' + connection.getAllParticipants().join(', ');
    } else {
      document.querySelector('h1').innerHTML = 'Seems session has been closed or all participants left.';
    }
  };
  connection.onEntireSessionClosed = function (event) {
    document.getElementById('share-file').disabled = true;
    document.getElementById('input-text-chat').disabled = true;
    document.getElementById('btn-leave-room').disabled = true;
    document.getElementById('open-or-join-room').disabled = false;
    document.getElementById('open-room').disabled = false;
    document.getElementById('join-room').disabled = false;
    document.getElementById('room-id').disabled = false;
    connection.attachStreams.forEach(function (stream) {
      stream.stop();
    });
    // don't display alert for moderator
    if (connection.userid === event.userid) return;
    document.querySelector('h1').innerHTML = 'Entire session has been closed by the moderator: ' + event.userid;
  };
  connection.onUserIdAlreadyTaken = function (useridAlreadyTaken, yourNewUserId) {
    // seems room is already opened
    connection.join(useridAlreadyTaken);
  };
  function disableInputButtons() {
    document.getElementById('open-or-join-room').disabled = true;
    document.getElementById('open-room').disabled = true;
    document.getElementById('join-room').disabled = true;
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
  (function () {
    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
      return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match,
        search = window.location.search;
    while (match = r.exec(search.substring(1))) {
      params[d(match[1])] = d(match[2]);
    }window.params = params;
  })();
  var roomid = '';
  if (localStorage.getItem(connection.socketMessageEvent)) {
    roomid = localStorage.getItem(connection.socketMessageEvent);
  } else {
    roomid = connection.token();
  }
  document.getElementById('room-id').value = roomid;
  document.getElementById('room-id').onkeyup = function () {
    localStorage.setItem(connection.socketMessageEvent, this.value);
  };
  var hashString = location.hash.replace('#', '');
  if (hashString.length && hashString.indexOf('comment-') == 0) {
    hashString = '';
  }
  var roomid = params.roomid;
  if (!roomid && hashString.length) {
    roomid = hashString;
  }
  if (roomid && roomid.length) {
    document.getElementById('room-id').value = roomid;
    localStorage.setItem(connection.socketMessageEvent, roomid);
    // auto-join-room
    (function reCheckRoomPresence() {
      connection.checkPresence(roomid, function (isRoomExists) {
        if (isRoomExists) {
          connection.join(roomid);
          return;
        }
        setTimeout(reCheckRoomPresence, 5000);
      });
    })();
    disableInputButtons();
  }
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IceServer;
function IceServer() {

  // var connection = new RTCMultiConnection();

  connection.getExternalIceServers = false;
  connection.iceServers = [];

  // put your data in these 6-lines
  var ident = "simulaterz";
  var secret = "a05bf13e-ee11-11e6-aa16-822203ca03a2";
  var domain = "www.devgenz.com";
  var application = "app-";
  var room = "default";
  var secure = "1";

  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      xhr = null;
    }
    return xhr;
  }
  var url = 'https://service.xirsys.com/ice';
  var xhr = createCORSRequest('POST', url);
  xhr.onload = function () {
    var iceServers = JSON.parse(xhr.responseText).d.iceServers;
    connection.iceServers = iceServers;
  };
  xhr.onerror = function () {
    console.error('Woops, there was an error making xhr request.');
  };

  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhr.send('ident=' + ident + '&secret=' + secret + '&domain=' + domain + '&application=' + application + '&room=' + room + '&secure=' + secure);
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Socket = __webpack_require__(0);

var _Socket2 = _interopRequireDefault(_Socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socket = new _Socket2.default(); // import $ from 'jquery';

/***/ })
/******/ ]);