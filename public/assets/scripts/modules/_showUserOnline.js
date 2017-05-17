function waiting() {
  var { userObject, connection } = require('./../Chat');
  var audiosContainer = document.getElementById('audios-container');

  connection.onstream = function(event) {
    var mediaElement = document.createElement('li');
    var span = document.createElement('span');
    var div = document.createElement('div');

    mediaElement.id = event.streamid;
    span.className = "ion-android-contact icon__mic";
    span.id = "mute";
    div.className = "btn btn--online-list";
    span.innerHTML = '';

    div.innerHTML = event.extra.uname;

    div.appendChild(span);
    mediaElement.appendChild(div);
    audiosContainer.appendChild(mediaElement);
  };

  connection.onstreamended = function(event) {
    var mediaElement = document.getElementById(event.streamid);
    if(mediaElement) {
      mediaElement.parentNode.removeChild(mediaElement);
    }
  };
}

function showUserOnline() {
  setTimeout(waiting , 1);
}

module.exports = { showUserOnline };
