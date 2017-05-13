var logoutButton = document.getElementById('logout');
logoutButton.style.cursor = 'pointer';

var logout = logoutButton.onclick = function() {
  alert("Logout Complete");
  localStorage.clear();
  window.location = "/";
};

module.exports = { logout };
