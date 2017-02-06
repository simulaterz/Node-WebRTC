const videoArea = document.querySelector('video');
const videoSelect = document.querySelector('#camera');

//    startStream();

videoSelect.onchange = startStream;

navigator.mediaDevices.enumerateDevices()
    .then(getCameras)
    .catch((err) => {
        console.log(err.name + ": " + err.message);
    });

function getCameras(devices) {
    devices.forEach(function (device) {
        var option = document.createElement('option');
        option.value = device.id;

        if (device.kind === 'videoinput') {
            option.text = device.label || 'camera ' + (videoSelect.length + 1);
            videoSelect.appendChild(option);
        }
    });
}

function startStream() {
    const videoSource = videoSelect.value;
    const constraints = {
        audio: false,
        video: false
    };

    AdapterJS.webRTCReady((isUsingPlugin) => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then(onSuccess)
            .catch(onError);
    });
}

function onSuccess(stream) {
    console.log("Success! We have a stream");
    videoArea.srcObject = stream;
    videoArea.onloadedmetadata = () => {
        videoArea.play();
    };
}

function onError(err) {
    console.log(`Error with getUserMedia : ${err}`);
}