function renderMainPage() {
  var { userObject } = require('./../Main');

  var favroomID = userObject.favroom.roomid;
  var favroomName = userObject.favroom.roomname;

  var userSpan = document.getElementById('userSpan');
  userSpan.innerHTML = userObject.username;

  if(favroomID && favroomName) {
    var favroomDiv = document.getElementById('favroomDiv');
    favroomDiv.innerHTML = '';

    var li = document.createElement('li');
    var link = document.createElement('a');
    var span = document.createElement('span');

    link.className = "btn btn--room btn--room--fav";
    link.href = "/chat?roomid=" + favroomID;
    link.innerHTML = favroomName;
    span.className = "ion-android-delete icon__del";
    span.innerHTML = '';
    link.appendChild(span);
    li.appendChild(link);

    favroomDiv.appendChild(li);
  }
}

function renderMain() {
  setTimeout(renderMainPage , 1);
}

module.exports = {renderMain};
