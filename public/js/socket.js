const myName = document.querySelector('#myName');
const myMessage = document.querySelector('#myMessage');
const sendMessage = document.querySelector('#sendMessage');
const chatArea = document.querySelector('#chatArea');
const signalingArea = document.querySelector('#signalingArea');

const ROOM = "chat";
const SIGNAL_ROOM = "signal_room";

var socket = io.connect();

sendMessage.addEventListener('click', (ev) => {
    socket.emit('send', {
        room: ROOM,
        message: myMessage.value,
        author: myName.value,
    });
    ev.preventDefault();
});

socket.emit('ready', {
    chat_room: ROOM,
    signal_room: SIGNAL_ROOM
});

socket.emit('signal', {
    type: 'user_here',
    message: 'Are you ready for a call?',
    room: SIGNAL_ROOM
});

socket.on('announce', (data) => {
    displayMessage(data.message);
});

socket.on('message', (data) => {
    displayMessage(`${data.author} : ${data.message}`);
});

function displayMessage(message) {
    chatArea.innerHTML = chatArea.innerHTML + "<br>" + message;
}

function displaySignalMessage(message) {
    signalingArea.innerHTML = signalingArea.innerHTML + "<br>" + message;
}