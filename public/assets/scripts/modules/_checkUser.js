// // var {connection} = require('./../Main.js');
// var onlineListDiv = document.getElementById('online-list');
//
// var checkUser = function() {
//
//   onlineListDiv.innerHTML = '';
//   connection.getAllParticipants().forEach(function(participantId) {
//     var user = connection.peers[participantId];
//     var hisUID = user.extra.realid;
//     var li = document.createElement('li');
//     var link = document.createElement('a');
//     var span = document.createElement('span');
//
//     link.className = "btn btn--online";
//     span.className = "ion-ios-chatbubble icon__status";
//     link.innerHTML = hisUID;
//     span.innerHTML = '';
//     link.appendChild(span);
//     li.appendChild(link);
//     onlineListDiv.insertBefore(li, onlineListDiv.firstChild);
//   });
//   setTimeout(checkUser, 3000);
// };
//
// module.exports = { checkUser };
