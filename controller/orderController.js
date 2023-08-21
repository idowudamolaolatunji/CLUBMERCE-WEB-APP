const crypto = require('crypto');

const axios = require('axios');
const _ = require("lodash");
const request = require("request");

const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const Order = require('../model/orderModel');
const Commissions = require('../model/commissionModel');
const AffiliateLink = require('../model/affiliteLinkModel');
const { initializePayment, verifyPayment } = require("../utils/paystack")(request);

// const UserPerformance = require('../model/userPerformanceModel');


// making orders and payments
exports.OrdersAndPayment = async (req, res) => {
    try {
        // Fetch the product information from the database
        const affiliate = await User.findOne({ slug: req.params.userSlug });
        const product = await Product.findOne({ slug: req.params.productSlug })
        if(!product) return res.status(404).json({ message: 'Product Not Found!' });

        // come back to remodify the buyers
        const buyer = await User.findById(req.user._id);
    
        const orderInfo = {
            quantity: req.body.quantity,
            address: req.body.address,
        };
        const paymentData = {
            email: req.body.email,
            fullname: req.body.fullname,
            amount: req.body.amount,
        }
        
        // Calculate the total amount for the order
        let charges;
        const orderAmount = product.price * orderInfo.quantity;
        const calcChargesAmount = 3 / 100 * orderAmount

        if(calcChargesAmount > 3000) {
            charges = 3000
        } else {
            charges = calcChargesAmount;
        }
        const totalAmount = orderAmount + charges;

        // Call the payment processing function
        await processPayment(totalAmount, paymentData, orderInfo, product, buyer, res, affiliate);
         
        const order = await Order.create({
            product: product._id,
            vendor: product.vendor,
            buyer: buyer._id,
            affiliate: affiliate._id,
            vendorProfit: totalAmount - product.commissionAmount - charges,
            affiliateCommission: product.commissionAmount,
            amount: totalAmount,
            ...orderInfo,
            createdAt: this.formattedCreatedAt
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

/*
exports.initializePayment = {
    acceptPayment: async(req, res) => {
      try {
        // request body from the clients
        const email = req.body.email;
        const amount = req.body.amount;
        // params
        const params = JSON.stringify({
          "email": email,
          "amount": amount * 100
        })
        // options
        const options = {
          hostname: 'api.paystack.co',
          port: 443,
          path: '/transaction/initialize',
          method: 'POST',
          headers: {
            Authorization: process.env.PAYSTACK_SECCRET_API_KEY, 
            'Content-Type': 'application/json'
          }
        }
        // client request to paystack API
        const clientReq = require('https').request(options, apiRes => {
          let data = ''
          apiRes.on('data', (chunk) => {
            data += chunk
          });
          apiRes.on('end', () => {
            console.log(JSON.parse(data));
            return res.status(200).json(data);
          })
        }).on('error', error => {
          console.error(error)
        })
        clientReq.write(params)
        clientReq.end()
        
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    },
}*/

/*
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
*/

// product-default.png
const processPayment = async (amount, paymentData, orderInfo, product, buyer, res, affiliate) => {
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
        const session = await require('mongoose').startSession();
        session.startTransaction();
    
        try {
            const ref = req.query.reference;
            verifyPayment(ref, async (err, body) => {
                if (err) {
                    console.log(err);
                    return res.redirect("/error");
                }

                response = JSON.parse(body);

                affiliate.wallet += product.commissionAmount;
                affiliate.productSold += 1;
                product.ordersCount += 1;
                product.profits += paidAmount - product.commissionAmount;
                // product.vendor.wallet += paidAmount - product.commissionAmount;
                product.vendor.wallet = product.profits;
                product.purchasesCount += 1;

                await product.save();
                await affiliate.save({ validateBeforeSave: false });
                

                const commission = await Commissions.create({
                    product: product._id,
                    affiliate: affiliate._id,
                    commissions: product.commissionAmount,
                    status: 'pending',
                    createdAt: this.formattedCreatedAt
                });

                const UpdateAffiliateLink = await AffiliateLink.findByIdAndUpdate(
                    { affiliate: affiliate._id, product: product._id }, 
                    {purchases: this.purchases += product.commissionAmount },
                    { new: true }
                )

                const orderTransaction = await Transaction.create({
                    affiliate: affiliate._id,
                    trnxType: "CR",
                    purpose: "order",
                    amount: amount,
                    }, { session }
                );

                return res.status(200).json({
                    status: 'success',
                    data: {
                        commission,
                        affiliatePerofmance,
                        orderTransaction,
                        UpdateAffiliateLink
                    }
                }).redirect("/success");
            });
            session.commitTransaction();
        } catch (error) {
            session.abortTransaction();
            return res.redirect("/error");
        }
    };
};
  
        
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

