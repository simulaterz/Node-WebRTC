// var connection = new RTCMultiConnection();

connection.getExternalIceServers = false;
connection.iceServers = [];

// put your data in these 6-lines
var ident       = "simulaterz";
var secret      = "a05bf13e-ee11-11e6-aa16-822203ca03a2";
var domain      = "www.devgenz.com";
var application = "app-";
var room        = "default";
var secure      = "1";

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}
var url = 'https://service.xirsys.com/ice';
var xhr = createCORSRequest('POST', url);
xhr.onload = function() {
    var iceServers = JSON.parse(xhr.responseText).d.iceServers;
    connection.iceServers = iceServers;
};
xhr.onerror = function() {
    console.error('Woops, there was an error making xhr request.');
};

xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhr.send('ident='+ident+'&secret='+secret+'&domain='+domain+'&application='+application+'&room='+room+'&secure='+secure);