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


/* function deparams setting params to global */

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
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var connection = new RTCMultiConnection('Main');

var _require = __webpack_require__(0),
    getParams = _require.getParams;

connection.socketURL = '/';
connection.socketMessageEvent = 'ChatRoom';
connection.enableLogs = false;
connection.session = { audio: true, data: true };
connection.sdpConstraints.mandatory = { OfferToReceiveAudio: true, OfferToReceiveVideo: false };
connection.mediaConstraints = { audio: true, video: false };
connection.maxParticipantsAllowed = 4;
connection.autoCloseEntireSession = false;

// connection.extra = {
//   x: connection.userid
// };
//
// connection.onopen = function(event) {
//     connection.send({
//       name: connection.userid
//     });
// };
//
// connection.onmessage = function(event) {
//     alert(event.userid + ' said: ' + event.extra.x);
// };

connection.audiosContainer = document.getElementById('audios-container');
connection.onstream = function (event) {
  var li = document.createElement('li');
  var span = document.createElement('span');
  var div = document.createElement('div');

  li.id = event.streamid;
  span.className = "ion-mic-a icon__mic";
  div.className = "btn btn--online-list";

  span.innerHTML = '';
  div.innerHTML = event.userid;

  div.appendChild(span);
  li.appendChild(div);
  connection.audiosContainer.appendChild(li);
};

connection.onstreamended = function (event) {
  var mediaElement = document.getElementById(event.streamid);
  if (mediaElement) {
    mediaElement.parentNode.removeChild(mediaElement);
  }
};

getParams();

var roomid = window.params.roomid;

connection.checkPresence(roomid, function (isRoomExist, roomid) {
  if (isRoomExist === true) {
    connection.join(roomid);
  } else {
    connection.open(roomid, true);
  }
});

/***/ })
/******/ ]);