var onlineListDiv = document.getElementById('online-list');

function loopCheckUser() {
  var {connection} = require('./../Main');
  onlineListDiv.innerHTML = '';

  connection.getAllParticipants().forEach(function(participantId) {
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

function checkUser() {
  setTimeout(loopCheckUser , 1); // setTimeout
};

module.exports = {checkUser};
