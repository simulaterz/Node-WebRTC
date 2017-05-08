function waiting() {
  const { userObject, connection } = require('./../Chat');
  const moment = require('moment-timezone');

  var time = function() { return moment().tz('Asia/Bangkok').format('LT'); }

  var userSpan = document.getElementById('userSpan');
  userSpan.innerHTML = userObject.username;

  var roomdiv = document.getElementById('room-name');
  roomdiv.innerHTML = 'Room : ' + window.params.roomname.toUpperCase();

  document.getElementById('input-text-chat').onkeyup = function(e) {
    if (e.keyCode != 13) return;
    this.value = this.value.replace(/^\s+|\s+$/g, '');
    if (!this.value.length) return;

    sendAndCreate(this.value);
    this.value = '';
  };

  document.getElementById('send-text').onclick = function() {
    var textfield = document.getElementById('input-text-chat');
    var text = textfield.value.replace(/^\s+|\s+$/g, '');
    if (!text.length) return;

    sendAndCreate(text);
    textfield.value = '';
  };

  function sendAndCreate(text) {
    connection.send({
      sender: connection.extra.uname,
      text: text,
      time: time()
    });
    renderChatBox({
      sender: connection.extra.uname,
      text: text,
      time: time()
    });
  };
};

function renderChatBox(event) {
  var chatContainer = document.querySelector('.chat-box__content__chat');
  var div = document.createElement('div');
  div.className = "btn btn--message";

  var headDiv = document.createElement('div');
  headDiv.className = "btn btn--message btn--message--title";

  var text = document.createElement('span');
  var time = document.createElement('span');
  time.className = "btn--message--title--time";

  console.log(event);

  headDiv.innerHTML = event.sender || event.data.sender;
  time.innerHTML = event.time || event.data.time;
  text.innerHTML = event.text || event.data.text;

  headDiv.appendChild(time);
  div.appendChild(headDiv);
  div.appendChild(text);

  var list = document.createElement('li');
  list.appendChild(div);

  chatContainer.appendChild(list);
  div.tabIndex = 0;
  div.focus();
  document.getElementById('input-text-chat').focus();
};

function renderChatPage() {
  setTimeout(waiting , 1);
};

module.exports = { renderChatPage, renderChatBox };
