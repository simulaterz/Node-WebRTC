function renderMainPage() {
  var { userObject } = require('./../Main');

  var roomid = userObject.favroom.roomid;
  var roomname = userObject.favroom.roomname;

  var userSpan = document.getElementById('userSpan');
  userSpan.innerHTML = userObject.username;

  var nofav = document.getElementById('nofav');
  nofav.className = "content-fav__no-fav";

  if(roomid && roomname) {

    var favroomDiv = document.getElementById('favroomDiv');
    favroomDiv.setAttribute('title', `Connect to Room ${roomname}`);
    favroomDiv.innerHTML = '';

    var li = document.createElement('li');
    var link = document.createElement('a');

    link.className = "btn btn--room btn--room--fav";
    link.href = '/chat?roomid='+ roomid + '&roomname=' + roomname;
    link.innerHTML = roomname;

    li.appendChild(link);
    favroomDiv.appendChild(li);
  }
}

function renderMain() {
  setTimeout(renderMainPage , 1);
}

module.exports = { renderMain };
