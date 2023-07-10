const crypto = require('crypto');

const mongoose = require('mongoose');
const axios = require('axios');
const _ = require("lodash");
const request = require("request");

const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const Order = require('../model/orderModel');
const Commissions = require('../model/commissionModel');

const { initializePayment, verifyPayment } = require("../utils/paystack")(request);


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
            email: req.body.email,
            fullname: req.body.fullname,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            postalCode: req.body.postalCode,
            address: req.body.address,
        };
        
        // Calculate the total amount for the order
        const totalAmount = product.price * orderInfo.quantity;

        // Call the payment processing function
        processPayment(totalAmount, req.body, orderInfo, product, user, res);
         
        const order = await Order.create({
            orderId: transactionId,
            vendor: product.vendor,
            amount: paidAmount - product.commissionAmount,
            orderInfo,
        });
    
        res.status(200).json({
            status: 'success',
            message: 'Transaction completed successfully',
            data: {
                newOrder: order,
            }
        });
        
    } catch (error) {
        res.status(500).json({ status: 'fail', message: 'Internal server error' });
    }
}




exports.pay = async (req, res, next) => {
    try {
      res.render("pay");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
}

exports.errorPage = async(req, res, next) => {
    try {
      res.render("error");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
}

exports.successPage = async(req, res, next) => {
    try {
      res.render("success");
    } catch (e) {
      return next(new ErrorResponse(e.message, 500));
    }
}


const processPayment = async (amount, paymentData, orderInfo, product, user, res) => {
    const form = _.pick(paymentData, ["amount", "email", "fullname"]);
    form.metadata = {
        full_name: form.full_name,
    };
    form.amount *= 100;
  
    initializePayment(form, (error, body) => {
        if (error) {
            //handle errors
            console.log(error);
            return res.redirect("/error");
        }
    
        response = JSON.parse(body);
        console.log(response);
        res.redirect(response.data.authorization_url);
    });
  
    const verifyPayment = async (req, res, next) => {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const ref = req.query.reference;
            verifyPayment(ref, async (err, body) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/error");
                }

                response = JSON.parse(body);

                user.wallet += product.commissionAmount;
                user.productSold += 1;
                product.ordersCount += 1
                product.vendor.wallet += paidAmount - product.commissionAmount;
                product.profits += paidAmount - product.commissionAmount;
                product.purchasesCount += 1;

                await product.save();
                await user.save({ validateBeforeSave: false });

                const commission = await Commissions.create({
                    product: product._id,
                    user: user._id,
                    commissions: product.commissionAmount,
                });

                Transaction.create({
                    user: user._id,
                    trnxType: "CR",
                    purpose: "order",
                    amount: amount,
                    }, { session });

                return res.redirect("/success");
            });
            session.commitTransaction();
        } catch (error) {
            session.abortTransaction();
            return res.redirect("/error");
        }
    };
  };
  


// Check the payment response for success
// if (paymentResponse.status === 200) {
//     const transactionId = paymentResponse.data.transactionId;
//     const paidAmount = paymentResponse.data.paidAmount;

//     // Update the vendor, affiliate, commissions, product and their wallet balances
//     user.wallet += product.commissionAmount;
//     user.productSold += 1;
//     product.ordersCount += 1
//     // product.vendor.wallet += paidAmount - product.commissionAmount;
//     product.profits += paidAmount - product.commissionAmount;
//     // product.purchasesCount += 1;

//     await product.save();
//     await user.save({ validateBeforeSave: false });


    // const commission = await Commissions.create({
    //     product: product._id,
    //     user: user._id,
    //     commissions: product.commissionAmount,
    // });
// } else {
//     res.status(400).json({ status: 'fail', message: 'Payment failed' });
// }




        
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