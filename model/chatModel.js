const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recieverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});


messageSchema.pre(/^find/, function(next) {
  this.populate({
      path: 'recieverId',
      select: 'fullName _id image'
  });
  next();
})

const Chat = mongoose.model('Chat', messageSchema);
module.exports = Chat;
