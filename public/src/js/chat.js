const chatForm = document.querySelector('.chat__form');
const chatBox = document.querySelector('.chat-mid');
const socket = io();

const personId = document.querySelector('')
let recipientUser;

if(personId) {
  personId.addEventListener('click', function(e) {
    const id = 
  })
}


socket.on('privateMessage', message => {
    console.log('ON')
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
        // const recipientUserId = document.querySelector('.recipient-user-select').value;

    // Emit the chat message to the server
        socket.emit('chatMessage', {
            text: msg,
            // senderUserId: senderUserId,
            // recipientUserId: recipientUserId,
            recipientUserId: '64a4483d886820076894d056', // Replace with the recipient user's ID
        });
    
        // Clear the input field after sending the message
        msgInput.value = '';
        console.log(msg)
    }
    
});
  

function displayMessage(message) {
    console.log('message form server side ' + message)
    const div = document.createElement('div');
    div.classList.add('chat-mid__me');
    div.classList.add('main');
    
    if (message.fromMe) {
        // Message is from the sender
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
      } else {
        // Message is from the recipient
        div.innerHTML = `
          <div class="img-box">
            <img class="chat-img from-img" src="asset/img/face.png" alt="" />
          </div>
          <div class="chat">
            <p class="chat-from__point"><span>~&nbsp;</span>${message.username}</p>
            <p class="chat-date">${message.time}</p>
            <p class="chat-from__message">${message.text}</p>
          </div>
        `;
      }

    document.querySelector('.chat-mid').appendChild(div);
}