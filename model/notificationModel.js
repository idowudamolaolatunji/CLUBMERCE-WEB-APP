// Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

messageSchema(/^find/, function(next) {
    this.populate({
        path: 'sender',
    }).populate({
        path: 'receiver'
    })

    next();
})

module.exports = mongoose.model('Message', messageSchema);
