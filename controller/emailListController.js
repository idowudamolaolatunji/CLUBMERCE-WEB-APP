const app = require('../app');
const EmailList = require('../model/emailListModel')


exports.getEmailList = async(req, res) => {
    try {
        const emailLists = await EmailList.find({});

        res.status(200).json({
            status: 'success',
            data: {
                list: emailLists,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Error getting email list'
        })
    }
}

exports.addEmail = async(req, res) => {
    try {
        const newEmail = await EmailList.create(req.body);

        res.status(200).json({
            status: 'success',
            data: {
                email: newEmail,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Error posting email'
        })
    }
}