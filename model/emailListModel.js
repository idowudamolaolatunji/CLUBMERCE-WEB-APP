const mongoose = require('mongoose');
const validate = require('validate');

const emailListSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        validate: [validator.isEmail, "Ënter a valid email"]
    }
});

const EmailList = mongoose.model('EmailList', emailListSchema);
module.exports = EmailList;