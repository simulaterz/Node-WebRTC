var publicRoomsDiv = document.getElementById('public-rooms');

var checkRoom = function() {
  function loopCheckRoom() {
    var {connection} = require('./../Main');

    connection.getPublicModerators(function(array) {
      publicRoomsDiv.innerHTML = '';
      array.forEach(function(moderator) {
        var li = document.createElement('li');
        var link = document.createElement('a');
        link.id = moderator.userid;
        link.className = "btn btn--room btn--room--main";
        link.href = '/chat?roomid='+ moderator.userid; // send params to join
        link.innerHTML = 'Create by ' + moderator.extra.uname;
        li.appendChild(link);
        publicRoomsDiv.insertBefore(li, publicRoomsDiv.firstChild);
      });
      setTimeout(loopCheckRoom, 1000);
    });
  };

  setTimeout(loopCheckRoom , 1); // setTimeout
};

module.exports = { checkRoom };
