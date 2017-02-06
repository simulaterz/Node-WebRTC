const myName = document.querySelector('#myName');
const myMessage = document.querySelector('#myMessage');
const sendMessage = document.querySelector('#sendMessage');
const chatArea = document.querySelector('#chatArea');
const signalingArea = document.querySelector('#signalingArea');

const ROOM = "chat";
const SIGNAL_ROOM = "signal_room";

var configuration = {
    'iceServers': [{
        'url': 'stun:stun.l.google.com:19302'
    }]
};
var rtcPeerConn;

var socket = io.connect();

socket.emit('ready', {
    chat_room: ROOM,
    signal_room: SIGNAL_ROOM
});

socket.emit('signal', {
    type: 'user_here',
    message: 'Are you ready for a call?',
    room: SIGNAL_ROOM
});

socket.on('signaling_message', (data) => {
    displaySignalMessage(`Signal received: ${data.type}`);

    if (!rtcPeerConn) {
        startSignaling();
    }

    if (data.type != 'user_here') {
        var message = JSON.parse(data.message);
        if (message.sdp) {
            rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
                if (rtcPeerConn.remoteDescription.type == 'offer') {
                    rtcPeerConn.createAnswer(sendLocalDesc, logError);
                }
            }, logError);
        }
        else {
            rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
        }
    }
});

function startSignaling() {
    displaySignalMessage("starting signaling...");

    rtcPeerConn = new RTCPeerConnection(configuration);
    rtcPeerConn.onicecandidate = (evt) => {
        if (evt.candidate) {
            socket.emit('signal', {
                type: 'ice candidate',
                message: JSON.stringify({
                    candidate: evt.candidate
                }),
                room: SIGNAL_ROOM
            });
            displaySignalMessage("completed that ice candidate...");
        }
    };
    rtcPeerConn.onnegotiationneeded = () => {
        displaySignalMessage("on negotiation called");
        rtcPeerConn.createOffer(sendLocalDesc, logError);
    };
    rtcPeerConn.onaddstream = (evt) => {
        displaySignalMessage("going to add their stream...");
        theirVideoArea.src = URL.createObjectURL(evt.stream);
    };
    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    })
        .then((stream) => {
            displaySignalMessage("going to display my stream...");
            myVideoArea.src = URL.createObjectURL(stream);
            rtcPeerConn.addStream(stream);
        })
        .catch(logError);
}

function sendLocalDesc(desc) {
    rtcPeerConn.setLocalDescription(desc, () => {
        displaySignalMessage("sending local description");
        socket.emit('signal', {
            type: 'SDP',
            message: JSON.stringify({
                'sdp': rtcPeerConn.localDescription
            }),
            room: SIGNAL_ROOM
        });
    }, logError);
}

function logError(err) {
    displaySignalMessage(`${err.name} : ${err.message}`);
}


socket.on('announce', (data) => {
    displayMessage(data.message);
});

socket.on('message', (data) => {
    displayMessage(`${data.author} : ${data.message}`);
});

sendMessage.addEventListener('click', (ev) => {
    socket.emit('send', {
        room: ROOM,
        message: myMessage.value,
        author: myName.value,
    });
    ev.preventDefault();
});

function displayMessage(message) {
    chatArea.innerHTML = chatArea.innerHTML + "<br>" + message;
}

function displaySignalMessage(message) {
    signalingArea.innerHTML = signalingArea.innerHTML + "<br>" + message;
}