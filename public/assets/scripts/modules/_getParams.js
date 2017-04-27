var getParams = function() {
  var params = {},
  r = /([^&=]+)=?([^&]*)/g;

  function d(s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  }
  var match, search = window.location.search;
  while (match = r.exec(search.substring(1)))
  params[d(match[1])] = d(match[2]);
  window.params = params;
};

module.exports = { getParams };
