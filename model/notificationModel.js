// Message.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
    },
    message: {
        type: String,
        required: true,
    },
    notifiedAt: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isActive: {
        type: Boolean,
        default: function() {
            return Date.now() < (this.createdAt.getTime() + (24 * 60 * 60 * 1000));
        }
    }
}, {
    timestamp: true
});

notificationSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'user',
      select: '_id fullName role'
    });
    next();
})

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
