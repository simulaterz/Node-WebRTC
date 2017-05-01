var { getCookies } = require('./_getCookies');
var { deleteAllCookies } = require('./_deleteAllCookies');
var clientToken;

if (getCookies().token) {
  localStorage.setItem("RTCToken", getCookies().token);
}
clientToken = localStorage.getItem("RTCToken");

deleteAllCookies();

module.exports = { clientToken };
