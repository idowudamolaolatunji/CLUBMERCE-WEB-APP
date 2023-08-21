const http = require('http')
const { promisify } = require('util')

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const socket = require('socket.io');
const jwt = require('jsonwebtoken');


dotenv.config({path: './config.env'}); // always run before the app
const app = require('./app');
const server = http.createServer(app);


const io = socket(server);

const formatMessage = require('./utils/formatMessage');

// io.on('connection', socket => {
//     // console.log(`connected  ${socket.id}`);
//     const token = socket.handshake.headers.cookie.split('=').at(-1);
//     const userId = jwt.verify(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN, function(err, decoded) {
//         console.log(decoded.id) 
//     });
    

//     socket.on('chatMessage', msg => {
//         io.emit('message', formatMessage('User', msg))
//         console.log(formatMessage('User', msg), socket.id);
//     });
    
// });


const User = require('./model/usersModel')
io.on('connection', async (socket) => {
    try {
      // Get the token from the cookies and decode to get the user ID
        const token = socket.handshake.headers.cookie.split('=').at(-1);
        const decoded = await promisify(jwt.verify)(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN);
        const userId = decoded.id;
    
        // Fetch the user from the database
        const user = await User.findById(userId);

        // If the user is not found, handle the error
        if (!user) {
        console.log('User not found.');
        socket.disconnect(); // Disconnect the socket to prevent unauthorized access
        return;
        }

        console.log(`User ${userId} connected`);

        // Listen for chatMessage event
        socket.on('chatMessage', async (data) => {
            try {
                // Fetch the recipient user from the database
                const recipientUser = await User.findById(data.recipientUserId);

                // If the recipient user is not found, handle the error
                if (!recipientUser) {
                console.log('Recipient user not found.');
                return;
                }

                // Emit the private message to both sender and recipient
                socket.emit('message', formatMessage('You', data.text)); // To the sender
                io.to(recipientUser.socketId).emit('message', formatMessage(user.fullName, data.text)); // To the recipient
                console.log('receipiant id: '+data.recipientUserId, user.fullName, 'my id: '+userId, data.text)
            
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        // // Save the socket ID in the user model
        user.socketId = socket.id;
        await user.save({validateBeforeSave: false});
        
    } catch (error) {
      console.error('Error in socket connection:', error);
    }
});


const DB = process.env.CLUBMERCE_DB.replace('<PASSWORD>', process.env.CLUBMERCE_DB_PASSWORD);

mongoose.connect(DB)
.then(con => {
    console.log('Db connection successful!');
}).catch(err => {
    console.log(err);
});

const port = process.env.PORT || 8000;

server.listen(port, process.env.HOST, () => {
    console.log(`App running on port ${port}...`);
});