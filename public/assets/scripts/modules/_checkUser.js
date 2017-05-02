var onlineListDiv = document.getElementById('online-list');

function loopCheckUser() {
  var {connection, userObject} = require('./../Main');
  onlineListDiv.innerHTML = '';

  listUser(userObject.username);

  connection.getAllParticipants().forEach(function(participantId) {
    var user = connection.peers[participantId];
    var hisUID = user.extra.uname;

    if (connection.extra.uname === hisUID) return;
    listUser(hisUID);
    // var li = document.createElement('li');
    // var link = document.createElement('a');
    // var span = document.createElement('span');

    // link.className = "btn btn--online";
    // link.innerHTML = hisUID;
    // span.className = "ion-ios-chatbubble icon__status";
    // span.innerHTML = '';
    // link.appendChild(span);
    // li.appendChild(link);
    // onlineListDiv.insertBefore(li, onlineListDiv.firstChild);
  });
  setTimeout(loopCheckUser, 3000);
};

function listUser(username) {
  var li = document.createElement('li');
  var link = document.createElement('a');
  var span = document.createElement('span');

  link.className = "btn btn--online";
  link.innerHTML = username;
  span.className = "ion-ios-chatbubble icon__status";
  span.innerHTML = '';
  link.appendChild(span);
  li.appendChild(link);
  onlineListDiv.insertBefore(li, onlineListDiv.firstChild);
}

function checkUser() {
  setTimeout(loopCheckUser , 1); // setTimeout
};

module.exports = {checkUser};
