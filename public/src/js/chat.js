const socket = io();

socket.on('ChatMessage', message => {
    console.log(message)
});

const chatForm = document.querySelector('.chat__form');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = document.querySelector('.chat-end__input').value;
    console.log(msg)
    sendMessage(msg)
});

function sendMessage(msg) {
    const div = document.createElement('div');
    div.classList.add('chat-mid__me');
    div.classList.add('main')
    div.innerHtml = `
        <div class="img-box"><img class="chat-img from-img" src="asset/img/avatar.png" alt=""/></div>
        <div class="chat">
            <p class="chat-me__point"><span>~&nbsp;</span>Me</p>
            <p class="chat-date">17:10</p>
            <p class="chat-me__message">${msg}</p>
        </div>
    `;

    document.querySelector('.chat-mid').appendChild(div)
}