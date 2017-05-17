const $ = require('jquery');

var favBth = document.getElementById('addfavroom');
favBth.setAttribute('title', "Add Favorite Room");
favBth.style.cursor = 'pointer';

var addfavroom = favBth.onclick = function() {
  var clientToken = localStorage.getItem("RTCToken");

  var roomname = window.params.roomname;
  var roomid = window.params.roomid;

  $.ajax({
    url: `/addroom/${clientToken}/${roomname}/${roomid}`,
    type: "get",
    success: function() {
      alert("Add Room Complete")
    },
    error: function(err) {
      alert("Error to add favRoom")
      window.location = "/";
    }
  });
};

module.exports = { addfavroom };
