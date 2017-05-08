var { getCookies } = require('./_getCookies');
var { deleteAllCookies } = require('./_deleteAllCookies');

if (getCookies().token) {
  localStorage.setItem("RTCToken", getCookies().token);
}

var clientToken = localStorage.getItem("RTCToken");
deleteAllCookies();

module.exports = { clientToken };
