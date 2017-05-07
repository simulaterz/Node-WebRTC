var publicRoomsDiv = document.getElementById('public-rooms');

function loopCheckRoom() {
  var {connection} = require('./../Main');

  connection.getPublicModerators(function(array) {
    publicRoomsDiv.innerHTML = '';
    array.forEach(function(moderator) {
      var li = document.createElement('li');
      var link = document.createElement('a');
      var uname = moderator.extra.uname;
      var roomid = moderator.extra.roomid;
      var roomname = moderator.extra.roomname;

      link.id = moderator.userid;
      link.className = "btn btn--room btn--room--main";
      link.href = '/chat?roomid='+ roomid + '&roomname=' + roomname; // send params to join
      link.innerHTML = roomname + ' By ' + uname;
      li.appendChild(link);
      publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
    });
    setTimeout(loopCheckRoom, 1000);
  });
};

function checkRoom() {
  setTimeout(loopCheckRoom , 1);
}

module.exports = { checkRoom };
