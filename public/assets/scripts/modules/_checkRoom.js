var connection = new RTCMultiConnection();
var publicRoomsDiv = document.getElementById('public-rooms');

var checkRoom = function() {
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
    setTimeout(checkRoom, 3000);
  });
};

module.exports = { checkRoom };
