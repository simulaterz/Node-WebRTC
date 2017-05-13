function loopCheckRoom() {
  var {connection} = require('./../Main');
  var publicRoomsDiv = document.getElementById('public-rooms');

  connection.getPublicModerators(function(array) {

    publicRoomsDiv.innerHTML = '';

    if(array.length === 0) {
      var li = document.createElement('li');
      li.className = 'content-roomlist__no-room';
      var span = document.createElement('span');
      span.innerHTML = "No Room Open";

      li.appendChild(span);
      publicRoomsDiv.appendChild(li);
    }

    array.forEach(function(moderator) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      var uname = moderator.extra.uname;
      var roomid = moderator.extra.roomid;
      var roomname = moderator.extra.roomname.toUpperCase();

      link.id = moderator.userid;
      link.className = "btn btn--room btn--room--main";
      link.href = '/chat?roomid='+ roomid + '&roomname=' + roomname; // send params to join
      link.innerHTML = roomname + ' | ' + uname;
      li.appendChild(link);
      publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
    });
    setTimeout(loopCheckRoom, 3000);
  });
};

function checkRoom() {
  setTimeout(loopCheckRoom , 1);
}

module.exports = { checkRoom };
