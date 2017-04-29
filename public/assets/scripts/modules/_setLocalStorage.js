var clientToken;

if (localStorage.getItem("RTCToken") && token !== "") {
  var local = localStorage.getItem("RTCToken");
  var server = token;
  
  if (local !== server) {
    clientToken = server;
    localStorage.setItem("RTCToken", clientToken);
  }
  clientToken = localStorage.getItem("RTCToken");
} else {
  clientToken = token;
  localStorage.setItem("RTCToken", clientToken);
}

module.exports = { clientToken };
