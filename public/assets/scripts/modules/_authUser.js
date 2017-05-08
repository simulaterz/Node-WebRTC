const $ = require('jquery');

function authUser(clientToken) {
  return $.ajax({
    url: `/check/${clientToken}`,
    type: "get",
    error: function(err) { window.location = "/"; }
  });
}

module.exports = { authUser };
