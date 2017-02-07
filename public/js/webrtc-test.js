// url's'
var configuration = {
    'iceServers': [{
        'urls': 'stun:stun.l.google.com:19302'
    }]
};
var rtcPeerConn;

socket.on('signaling_message', (data) => {
    displaySignalMessage(`Signal received: ${data.type}`);

    if (!rtcPeerConn) {
        startSignaling();
    }

    if (data.type != 'user_here') {
        var message = JSON.parse(data.message);
        if (message.sdp) {
            var desc = message.sdp;

            console.log(desc.type);
            // if we get an offer, we need to reply with an answer
            if (desc.type == "offer") {
                displaySignalMessage("offer ...");
                rtcPeerConn.setRemoteDescription(desc)
                    .then(() => {
                        return rtcPeerConn.createAnswer();
                    })
                    .then((answer) => {
                        return rtcPeerConn.setLocalDescription(answer);
                    })
                    .then(() => {
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
                displaySignalMessage("answer ...");
                rtcPeerConn.setRemoteDescription(desc).catch(logError);
            } else {
                log("Unsupported SDP type. Your code may differ here.");
            }
        } else {
            rtcPeerConn.addIceCandidate(message.candidate).catch(logError);
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
                    "candidate": evt.candidate
                }),
                room: SIGNAL_ROOM
            });
            displaySignalMessage("completed that ice candidate...");
        }
    };

    rtcPeerConn.onnegotiationneeded = () => {
        rtcPeerConn.createOffer().then((offer) => {
            displaySignalMessage("on negotiation called");

            return rtcPeerConn.setLocalDescription(offer);
        }).then(() => {
            displaySignalMessage("sending local description");

            socket.emit('signal', {
                type: 'SDP',
                message: JSON.stringify({"sdp": rtcPeerConn.localDescription}),
                room: SIGNAL_ROOM
            })
        }).catch(logError);
    };

    rtcPeerConn.ontrack = (evt) => {
        if (evt.track.kind === "video") {
            displaySignalMessage("going to add their stream...");
            theirVideoArea.srcObject = evt.streams[0];
        }
    };

    navigator.mediaDevices.getUserMedia({
        "audio": true,
        "video": true
    })
        .then((stream) => {
            displaySignalMessage("going to display my stream...");
            myVideoArea.srcObject = stream;
            rtcPeerConn.addStream(stream);
        })
        .catch(logError);
};

function logError(error) {
    displaySignalMessage(`${error.name} : ${error.message}`);
}

