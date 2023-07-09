const crypto = require('crypto')

const mongoose = require('mongoose');
const axios = require('axios');

const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const Order = require('../model/orderModel');
const Commissions = require('../model/commissionModel');



// making orders and payments
exports.OrdersAndPayment = async (req, res) => {
    try {
        // Fetch the product information from the database
        const user = await User.findOne({ slug: req.params.userSlug });
        const product = await Product.findOne({ slug: req.params.productSlug }).populate('vendor')
    
        if(!product) return res.status(404).json({ message: 'Product Not Found!' })
        const orderInfo = {
            quantity: req.body.quantity,
            product: product.name,
            emailAddress: req.body.emailAddress,
            fullname: req.body.fullname,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            postalCode: req.body.postalCode,
            address: req.body.address,
        };
        const paymentInfo = {
            bankName: req.body.bankName,
            holdersName: holdersName,
            accountNumber: req.body.accountNumber
        }

        // Calculate the total amount for the order
        const totalAmount = product.price * orderInfo.quantity;
          
        
        // Make a transfer request to the Paystack payment API
        const response = await axios.post('https://api.paystack.co/transfer', {
            source: 'balance',
            reason: 'Transfer to bank account',
            amount: totalAmount * 100, // Convert amount to kobo (Paystack uses kobo as the currency unit)
            recipient: paymentInfo, // Recipient bank account details
            currency: 'NGN', // Currency code (e.g., NGN for Nigerian Naira)
        }, {
            headers: {
            Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, // Replace with your Paystack secret key
            'Content-Type': 'application/json',
            },
        });

        const paymentResponse = response.json();

           
        // Check the payment response for success
        if (paymentResponse.status === 200) {
            const transactionId = paymentResponse.data.transactionId;
            const paidAmount = paymentResponse.data.paidAmount;

            // Update the vendor, affiliate, commissions, product and their wallet balances
            user.wallet += product.commissionAmount;
            user.productSold += 1;
            product.ordersCount += 1
            // product.vendor.wallet += paidAmount - product.commissionAmount;
            product.profits += paidAmount - product.commissionAmount;
            // product.purchasesCount += 1;

            await product.save();
            await user.save({ validateBeforeSave: false });

            const order = await Order.create({
                orderId: transactionId,
                vendor: product.vendor,
                amount: paidAmount - product.commissionAmount,
                orderInfo,
            });
            const commission = await Commissions.create({
                product: product._id,
                user: user._id,
                commissions: product.commissionAmount,
            });
        
            res.status(200).json({
                status: 'success',
                message: 'Transaction completed successfully',
                data: {
                    newOrder: order,
                    affCommission: commission,
                }
            });

        } else {
        res.status(400).json({ status: 'fail', message: 'Payment failed' });
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
}
        
//get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1});
        // const orders = await Order.find().sort({ date: -1}).populate('product', 'name')
        
        if(orders.length < 1){
            return res.json({msg: 'No order has been made yet'})
        }
        res.status(200).json({
            status: 'success',
            count: orders.length,
            data: {
                order: orders,
            }
        });
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })
    }
}


//get a single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        // const order = await Order.findById(req.params.id).populate('product', 'name description amount')
        if(!order){
            return res.status(404).json({
                message: 'Order Not Found!'
            })
        }
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};