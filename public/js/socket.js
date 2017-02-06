const myName = document.querySelector('#myName');
const myMessage = document.querySelector('#myMessage');
const sendMessage = document.querySelector('#sendMessage');
const chatArea = document.querySelector('#chatArea');
const ROOM = "chat";

var socket = io.connect();

socket.emit('ready', ROOM);

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