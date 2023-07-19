// chatController.js
const Message = require('./../model/notificationModel');

// Create a new message
exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = await Message.create({ sender, receiver, message });
    
    // Emit the new message to the receiver using Socket.IO
    req.app.get('io').to(receiver).emit('newMessage', newMessage);

    res.json(newMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'An error occurred while creating the message' });
  }
};
