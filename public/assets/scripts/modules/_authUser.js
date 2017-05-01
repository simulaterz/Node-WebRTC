const $ = require('jquery');

function authUser(clientToken) {
  return $.ajax({
    url: `/check/${clientToken}`, type: "get",
    success: function(res) {
      var num = Math.floor(Math.random() * 3) + 1;
      res.user._id = num.toString();
      res.var = 'aaa'; // add some res
    },
    error: function(err) { window.location = "/"; }
  });
}

module.exports = {authUser};
