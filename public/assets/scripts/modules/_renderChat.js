function renderChatZone(event) {
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
}

function renderChat() {
  var { userObject } = require('./../Main');
  console.log('+++++++++++++++');

  // var userSpan = document.getElementById('userSpan');
  // userSpan.innerHTML = userObject.username;
}

function renderChatPage() {
  setTimeout(renderChat , 1);
}

module.exports = { renderChatPage, renderChatZone };
