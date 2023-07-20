const chatForm = document.querySelector('.chat__form');
const chatBox = document.querySelector('.chat-mid');
const socket = io();

socket.on('message', message => {
    displayMessage(message);

    // scroll down
    chatBox.scrollTop = chatBox.scrollHeight;
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msgInput = document.querySelector('.chat-end__input');
    const msg = msgInput.value.trim();

    if (msg !== '') {
        // Emit the chat message to the server
        socket.emit('chatMessage', msg);

        // Clear the input field after sending the message
        msgInput.value = '';
    }
    
});
  

function displayMessage(message) {
    const div = document.createElement('div');
    div.classList.add('chat-mid__me');
    div.classList.add('main');
    div.innerHTML = `
        <div class="img-box">
            <img class="chat-img" src="asset/img/avatar.png" alt="" />
        </div>
        <div class="chat">
            <p class="chat-me__point"><span>~&nbsp;</span>${message.username}</p>
            <p class="chat-date">${message.time}</p>
            <p class="chat-me__message">${message.text}</p>
        </div>
    `;

    document.querySelector('.chat-mid').appendChild(div);
}