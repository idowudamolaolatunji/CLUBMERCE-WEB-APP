const moment = require('moment');

const User = require('../model/usersModel');
const Transaction = require('../model/transactionModel');
const Notification = require('../model/notificationModel');
const verifyPayment = require('../utils/verifyPayment');
const koboToNaira = require('../utils/koboToNaira');
// const formattedDate = moment(inputDateString).format('dddd, MMMM DD YYYY HH:mm:ss');


// verify transaction
exports.verifyPaystackPayment = async function(req, res) {
    try {
        const { reference } = req.params;
        const paymentVerfification = await verifyPayment(reference);
        const [booValue, response] = paymentVerfification;
        if (booValue) {
            await createTransaction(response, req, res)
        } else {
            throw new Error('Payment verification failed');
        }
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

async function createTransaction(paymentResponse, _, response) {
    try {
        const { data  } = paymentResponse.data;
        const subcribingUser = await User.findOne({ email: data.customer.email });
        const formattedDate = moment(data.paidAt).format('MMMM DD YYYY');
        const formattedAmount = koboToNaira(Number(data.amount));

        const subcriptionTransaction = await Transaction.create({
            transactionId: data.id,
            user: subcribingUser._id,
            amount: formattedAmount,
            status: 'success',
            purpose: 'subscription',
            paidAt: formattedDate,
        });

        const subscriptionNotification = await Notification.create({
            user: subcribingUser._id,
            message: `You just upgraded you account to ${Number(data.amount) < 2000000 ? 'standard' : 'premium'} account!`,
            notifiedAt: formattedDate
        });
        
        subcribingUser.vendorSubscriptionActive = true;
        subcribingUser.vendorSubscriptionType = `${Number(data.amount) < 2000000 ? 'standard' : 'premium'}`
        subcribingUser.vendorAccountTypeExpiresIn = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        subcribingUser.save({ validateBeforeSave: false });

        response.status(201).json({
            status: 'success',
            data: {
                transaction: subcriptionTransaction,
                notification: subscriptionNotification
            }
        })

    } catch(err) {
        response.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}