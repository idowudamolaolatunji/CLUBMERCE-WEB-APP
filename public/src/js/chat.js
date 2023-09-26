// const chatForm = document.querySelector('.chat__form');
// const chatBox = document.querySelector('.chat-mid');
// const socket = io();

// const personId = document.querySelector('')
// let recipientUser;

// if(personId) {
//   personId.addEventListener('click', function(e) {
//     const id = 
//   })
// }

/*
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
*/

/*
const profileImg = document.querySelector('.nav__image')
const menuImg = document.querySelector('.menu__profile-image');
const formImg = document.querySelector('.form__user-photo');
const dashboard = document.querySelector('.section__dashboard');

const userData = dashboard.getAttribute('data-user');
const imageUrl = JSON.parse(userData)['image'];
profileImg.src = imageUrl;
menuImg.src = imageUrl;
formImg.src = imageUrl;
console.log('i am connected')
*/




/*
const chatbotToggler = document.querySelector(".chat__box-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatboxChat = document.querySelector(".chat__box--chat");
const chatInput = document.getElementById("textarea");
const sendChatBtn = document.getElementById("send-btn");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
  // Create a chat <li> element with passed message and className
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", `${className}`);
  let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
  chatLi.innerHTML = chatContent;
  chatLi.querySelector("p").textContent = message;
  return chatLi; // return chat <li> element
}



const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user entered message and remove extra whitespace
  if(!userMessage) return;

  console.log(userMessage)
  const message = { message: userMessage };
  fetch('/api/message/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify(message)
  });
  
  // Clear the input textarea and set its height to default
  chatInput.value = "";
  chatInput.style.height = `${inputInitHeight}px`;

  // Append the user's message to the chatboxChat
  chatboxChat.appendChild(createChatLi(userMessage, "outgoing"));
  chatboxChat.scrollTo(0, chatboxChat.scrollHeight);
}

chatInput.addEventListener("input", () => {
  // Adjust the height of the input textarea based on its content
  chatInput.style.height = `${inputInitHeight}px`;
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
  if(e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chat__box"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chat__box"));
*/


const chatButton = document.querySelector('.chat__box-toggler');
const { id, fullname, img } = chatButton.dataset;
console.log(id, fullname, img);

// Enable pusher logging - don't include this in production
var pusher = new Pusher('3518bd1be26b07addc01', {
  cluster: 'mt1'
});
pusher.logToConsole = true;
var channel = pusher.subscribe(`conversation-${id}`); // id === user's id
channel.bind('message', function(data) {
  alert(JSON.stringify(data));
  if(data.senderId !== id && data.recieverId === id) {
    appendMessage('', 'friend-message', data.message);
  }
});


// function appendMessage(name, img, side, text) {
//   //   Simple solution for small apps
//   const msgHTML = `
//     <div class="msg ${side}-msg">
//       <div class="msg-img" style="background-image: url(${img})"></div>

//       <div class="msg-bubble">
//         <div class="msg-info">
//           <div class="msg-info-name">${name}</div>
//           <div class="msg-info-time">${formatDate(new Date())}</div>
//         </div>

//         <div class="msg-text">${text}</div>
//       </div>
//     </div>
//   `;
// }



const messagesBox = document.querySelector('.messages-chat')
const inputChat = document.getElementById("write-message");
const sendChat = document.getElementById("send");

function appendMessage( _, side, text) {
  //   Simple solution for small apps
  const markup = `
    <div class="message ${side}">
      <span class="photo">
        <img src="/../asset/img/users/avatar.png" alt="chat image"/>
      </span>
      <p class="text">${text}</p>
    </div>
    <p class="${side}-time time">${new Date()}</p>
  `;

  messagesBox.insertAdjacentHTML("beforeend", markup);
  messagesBox.scrollTop += 500;
}

const handleChat = async() => {
  userMessage = inputChat.value.trim();
  if(!userMessage) return;

  const message = { message: userMessage };
  fetch('/api/message/send-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
      body: JSON.stringify(message)
  });
  appendMessage('', 'my-message', userMessage);
  inputChat.value = "";
  messagesBox.scrollTo(0, messagesBox.scrollHeight);
}


if(inputChat) {
  inputChat.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  });
}
if(sendChat)
  sendChat.addEventListener("click", handleChat);
