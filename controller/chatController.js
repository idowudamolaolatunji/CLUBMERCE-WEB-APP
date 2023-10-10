const mongoose = require('mongoose');
const pusher = require('../utils/pusherConfig');
const User = require('../model/usersModel');
const Chat = require('../model/chatModel');

exports.sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const senderId = req.user._id;
        // const recieverId = req.params;
        const recieverId = '650a2e27a196ec383445c145';
        // const channelName = `conversation-${recieverId}`;
        const channelName = `conversation-id`;
        
        const user = await User.findById(recieverId)

        const messageData = {
            senderId,
            recieverId,
            message
        };
        // trigger a pusher event
        pusher.trigger(channelName, "message", messageData);
        // db implementations goes here
        const newChat = await Chat.create({
            senderId,
            recieverId,
            message
        });

        res.status(200).json({ 
            status: 'success',
            data: {
                newChat,
            }
        });
    } catch(err) {
        console.log(err);
    }
}