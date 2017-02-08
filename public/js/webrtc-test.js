// url's'
var configuration = {
    "iceServers": [
        {"urls": [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302"
        ]}
    ]
};
var rtcPeerConn;

function startSignaling() {
    displaySignalMessage("starting signaling...");

    rtcPeerConn = new RTCPeerConnection(configuration);
    rtcPeerConn.onicecandidate = function (evt) {
        if (evt.candidate) {
            socket.emit('signal', {
                type: 'ice candidate',
                message: JSON.stringify({
                    "candidate": evt.candidate
                }),
                room: SIGNAL_ROOM
            });
            displaySignalMessage("completed that ice candidate...");
        }
    };

    rtcPeerConn.onnegotiationneeded = function () {
        rtcPeerConn.createOffer().then(function (offer) {
            displaySignalMessage("on negotiation called");
            return rtcPeerConn.setLocalDescription(offer);
        }).then(function () {
            displaySignalMessage("sending local description");
            socket.emit('signal', {
                type: 'SDP',
                message: JSON.stringify({"sdp": rtcPeerConn.localDescription}),
                room: SIGNAL_ROOM
            })
        }).catch(logError);
    };

    rtcPeerConn.ontrack = function (evt) {
        if (evt.track.kind === "video") {
            displaySignalMessage("going to add their stream...");
            theirVideoArea.srcObject = evt.stream;
        }
    };

    navigator.mediaDevices.getUserMedia({
        "audio": true,
        "video": true
    })
        .then(function (stream) {
            displaySignalMessage("going to display my stream...");
            myVideoArea.srcObject = stream;
            rtcPeerConn.addStream(stream);
        })
        .catch(logError);
};

socket.on('signaling_message', function (data) {
    displaySignalMessage(`Signal received: ${data.type}`);

    if (!rtcPeerConn) {
        startSignaling();
    }

    if (data.type != 'user_here') {
        var message = JSON.parse(data.message);
        if (message.sdp) {
            var desc = message.sdp;
            if (desc.type == "offer") {
                rtcPeerConn.setRemoteDescription(desc)
                    .then(function () {
                        return rtcPeerConn.createAnswer();
                    })
                    .then(function (answer) {
                        return rtcPeerConn.setLocalDescription(answer);
                    })
                    .then(function () {
                        socket.emit('signal', {
                            type: 'SDP',
                            message: JSON.stringify({
                                "sdp": rtcPeerConn.localDescription
                            }),
                            room: SIGNAL_ROOM
                        });
                    })
                    .catch(logError);
            } else if (desc.type == "answer") {
                rtcPeerConn.setRemoteDescription(desc)
                    .catch(logError);
            } else {
                log("Unsupported SDP type. Your code may differ here.");
            }
        } else {
            rtcPeerConn.addIceCandidate(message.candidate)
                .catch(logError);
        }
    }
});

function logError(error) {
    displaySignalMessage(`${error.name} : ${error.message}`);
}