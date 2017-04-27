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
/******/ ({

/***/ 1:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getParams = function getParams() {
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
};

module.exports = { getParams: getParams };

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var publicRoomsDiv = document.getElementById('public-rooms');

var checkRoom = function checkRoom() {
  function loopCheckRoom() {
    var _require = __webpack_require__(2),
        connection = _require.connection;

    connection.getPublicModerators(function (array) {
      publicRoomsDiv.innerHTML = '';
      array.forEach(function (moderator) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        link.id = moderator.userid;
        link.className = "btn btn--room btn--room--main";
        link.href = '/chat?roomid=' + moderator.userid; // send params to join
        link.innerHTML = 'Create by ' + moderator.extra.uname;
        li.appendChild(link);
        publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
      });
      setTimeout(loopCheckRoom, 1000);
    });
  };

  setTimeout(loopCheckRoom, 1); // setTimeout
};

module.exports = { checkRoom: checkRoom };

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var onlineListDiv = document.getElementById('online-list');

var checkUser = function checkUser() {
  function loopCheckUser() {
    var _require = __webpack_require__(2),
        connection = _require.connection;

    onlineListDiv.innerHTML = '';

    connection.getAllParticipants().forEach(function (participantId) {
      var user = connection.peers[participantId];
      var hisUID = user.extra.uname;
      var li = document.createElement('li');
      var link = document.createElement('a');
      var span = document.createElement('span');

      if (connection.extra.uname === hisUID) return;

      link.className = "btn btn--online";
      span.className = "ion-ios-chatbubble icon__status";
      link.innerHTML = hisUID;
      span.innerHTML = '';
      link.appendChild(span);
      li.appendChild(link);
      onlineListDiv.insertBefore(li, onlineListDiv.firstChild);
    });
    setTimeout(loopCheckUser, 3000);
  };

  setTimeout(loopCheckUser, 1); // setTimeout
};

module.exports = { checkUser: checkUser };

/***/ }),

/***/ 2:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var connection = new RTCMultiConnection();

var _require = __webpack_require__(118),
    checkRoom = _require.checkRoom;

var _require2 = __webpack_require__(119),
    checkUser = _require2.checkUser;

var _require3 = __webpack_require__(1),
    getParams = _require3.getParams;

connection.socketURL = '/';
connection.autoCloseEntireSession = false;
connection.socketMessageEvent = 'Main-RoomList'; // for setting params
connection.session = { data: true };
connection.enableLogs = false;
connection.extra = { uname: connection.userid };

connection.openOrJoin('Main', function () {
  // callback show content
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

// ......................Handling Room-ID................
var roomid = '';
if (localStorage.getItem(connection.socketMessageEvent)) {
  // check room name in localStorage
  roomid = localStorage.getItem(connection.socketMessageEvent);
} else {
  roomid = connection.token();
}
document.getElementById('room-id').value = roomid; // setting roomid to input
document.getElementById('room-id').onkeyup = function () {
  // insert roomid to localStorage
  localStorage.setItem(connection.socketMessageEvent, this.value);
};

document.getElementById('open-public-room').onclick = function () {
  this.disabled = true;
  var isPublicModerator = true;
  location.href = '/chat?roomid=' + document.getElementById('room-id').value;
};

module.exports = { connection: connection };

/***/ })

/******/ });