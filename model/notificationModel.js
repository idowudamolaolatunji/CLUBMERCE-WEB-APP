const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: String,
    status: {
        type: String,
        enum: ['delivered', 'sent'],
        default: 'delivered'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;