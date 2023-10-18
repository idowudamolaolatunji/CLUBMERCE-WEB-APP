const crypto = require('crypto');
const moment = require('moment');

// const axios = require('axios');
// const request = require("request");
// const _ = require("lodash");
const verifyPayment = require('../utils/verifyPayment');

const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const Order = require('../model/orderModel');
const Commission = require('../model/commissionModel');
const Transaction = require('../model/transactionModel');
const AffiliateLink = require('../model/affiliteLinkModel');
const Notification = require('../model/notificationModel');


exports.verifyPaystackPayment = async function(req, res) {
    try {
        const { reference } = req.params;
        const customHeader = req.headers['custom-header'];
        const paymentVerfification = await verifyPayment(reference);
        const [booValue, response] = paymentVerfification;

        if (booValue && customHeader) {
            const productsArray = JSON.parse(customHeader);
            const results = [];

            for (const product of productsArray) {
                const orderResult = await createOrder(response, req, res, product);
                results.push(orderResult);
            }

            return res.status(201).json({
                status: 'success',
                message: 'Orders created successfully',
                data: results,
            });
        // if (booValue && customHeader) {
        //     // Payment verified, proceed with order creation
        //     const linksArray = customHeader.split(',');
            
        //     await createOrder(response, req, res, linksArray);
        } else {
            throw new Error('Payment verification failed');
        }
    } catch(err) {
        console.error(err); 
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

async function createOrder(paymentResponse, _, response, item) {
    try {
        const { data } = paymentResponse.data;
        const buyer = await User.findOne({ email: data.customer.email });
        const oneLink = item.link.split('/').slice(-2);
        const [affiliateUsername, ___] = oneLink;
        const productId = item.id;
        const affiliate = await User.findOne({ username: affiliateUsername });
        const product = await Product.findById(productId);
        const vendor = await User.findById(product.vendor._id);

        const formattedAmount = `₦ ${Number(item.price).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        const formattedDate = moment(data.paidAt).format('MMMM DD YYYY');
        const productPrice = Number(item.price);
        const productCommission = Number(product.commissionAmount * item.quantity);
        const companySettlement = 10 / 100 * productPrice;
        const allSettlements = productCommission + companySettlement;
        const productQuantity = Number(Math.trunc(item.quantity));
        const productVendorFinalPayout = productPrice - allSettlements;

        const order = await Order.create({
            product: product._id,
            vendor: vendor._id,
            buyer: buyer._id,
            affiliate: affiliate._id,
            orderStatus: 'pending',
            companyProfilt: companySettlement,
            quantity: productQuantity,
            amount: productPrice,
            vendorProfit: productVendorFinalPayout,
            affiliateCommission: productCommission,
            email: data.customer.email,
            fullname: buyer.fullName,
            country: buyer.country,
            reference: data.id,
            orderedAt: formattedDate,
        });

        const commission = await Commissions.create({
            product: product._id,
            affiliate: affiliate._id,
            commissionAmount: productCommission,
            status: 'pending',
            paidAt: formattedDate
        });

        // const UpdateAffiliateLink = await AffiliateLink.findByIdAndUpdate(
        //     { affiliate: affiliate._id, product: product._id }, 
        //     { purchases: this.purchases += productQuantity, commission: this.commission += productCommission },
        //     { new: true }
        // );
        const UpdateAffiliateLink = await AffiliateLink.findOneAndUpdate(
            { affiliate: affiliate._id, product: product._id }, 
            { $inc: { commission: productCommission } },
            { new: true }
        );
        const orderTransaction = await Transaction.create({
            transactionId: data.id,
            user: buyer._id,
            purpose: "order",
            status: 'success',
            amount: formattedAmount,
            paidAt: formattedDate,
        });
        const formattedSalesAmount = `₦ ${Number(productVendorFinalPayout).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        const productPurchaseTransaction = await Transaction.create({
            transactionId: data.id,
            user: vendor._id,
            purpose: "purchase",
            status: 'success',
            amount: formattedSalesAmount,
            paidAt: formattedDate,
        });

        const formattedCommission = `₦ ${Number(productCommission).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
        const commissionTransaction = await Transaction.create({
            transactionId: data.id,
            user: affiliate._id,
            purpose: "commission",
            status: 'success',
            amount: formattedCommission,
            paidAt: formattedDate,
        });
        const commissionNotification = await Notification.create({
            user: affiliate._id,
            message: `You just made ${formattedCommission} from sales`,
            notifiedAt: formattedDate
        });
        const orderingNotification = await Notification.create({
            user: buyer._id,
            message: `You just ordered ${productQuantity} quantit${productQuantity > 1 ? 'ies' : 'y'} of ${product.name}`,
            notifiedAt: formattedDate
        });
        const recievingOrderNotification = await Notification.create({
            user: vendor._id,
            message: `You have a new Order, ${productQuantity} quantit${productQuantity > 1 ? 'ies' : 'y'} of ${product.name} from ${buyer.state}, ${buyer.country}`,
            notifiedAt: formattedDate
        });
        affiliate.pendingAmountWallet += productCommission;
        product.ordersCount += productQuantity;
        vendor.pendingAmountWallet += productVendorFinalPayout;
        await product.save();
        await vendor.save({ validateBeforeSave: false });
        await affiliate.save({ validateBeforeSave: false });
        return {
            newOrder: order,
            commission,
            orderTransaction,
            productPurchaseTransaction,
            commissionTransaction,
            UpdateAffiliateLink,
            commissionNotification,
            orderingNotification,
            recievingOrderNotification
        };

    
    } catch (err) {
        console.error(err); 
        response.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
}


const completedOrder = async (_, res, orderObj, reqUserId) => {
    try {
        const order = orderObj;
        const affiliate = await User.findById(order.affiliate._id);
        // const admin = await User.findOne({ role: 'admin' });
        const vendor = await User.findById(order.vendor._id);
        const buyer = await User.findById(order.buyer._id);
        const product = await Product.findById(order.product._id);
        const formattedDate = moment(new Date(Date.now())).format('MMMM DD YYYY');
        console.log('product:', product, reqUserId, 'orderObj', order, affiliate, vendor, buyer._id, formattedDate);
        // if(reqUserId !== buyer.id) return res.status(404).json({ message: 'Buyer not found' });

        const UpdateAffiliateLink = await AffiliateLink.findOneAndUpdate(
            { affiliate: affiliate._id, product: order.product._id },
            { $inc: { purchase: 1 } },
            { new: true }
        );

        const UpdateCommission = await Commission.findOneAndUpdate(
            { affiliate: affiliate._id, product: order.product._id },
            { status: 'success' },
            { new: true }
        );

        const completionOfOrderNotification = await Notification.create({
            user: buyer._id,
            message: `Your order for ${order.quantity} quantit${order.quantity > 1 ? 'ies' : 'y'} of ${product.name} has been completely delivered!`,
            notifiedAt: formattedDate
        });

        if (affiliate.pendingAmountWallet >= order.affiliateCommission) {
            affiliate.pendingAmountWallet -= order.affiliateCommission;
            affiliate.availableAmountWallet += order.affiliateCommission;
            affiliate.totalAmountWallet += order.affiliateCommission;
            affiliate.productSold = order.quantity;
        }
        if (vendor.pendingAmountWallet >= order.vendorProfit) {
            vendor.pendingAmountWallet -= order.vendorProfit;
            vendor.availableAmountWallet += order.vendorProfit;
            vendor.totalAmountWallet += order.vendorProfit;
            product.profits += order.vendorProfit;
            product.purchasesCount += order.quantity;
        }
        order.orderStatus = 'delivered';
        await order.save({});
        await vendor.save({ validateBeforeSave: false });
        await affiliate.save({ validateBeforeSave: false });

        return { UpdateAffiliateLink, completionOfOrderNotification, UpdateCommission };
        
        
    } catch(err) {
        console.log(err.message)
    }
}


exports.recievedOrder = async(req, res) => {
    try {
        const { orderId } = req.params;
        const buyerId = req.user._id;
        const order = await Order.findById(orderId);
        order.isRecieved = true;
        order.save({});
        console.log('Order now recieved');

        
        if(order.isRecieved && order.isDelevered) {
            const completed = await completedOrder(req, res, order, buyerId)

            res.status(200).json({
                status: 'success',
                message: 'Order completed!',
                data: {
                    completed
                }
            });
        } else {
            return res.status(200).json({ 
                status: 'success',
                message: 'Order now recieved!'
            });
        }

    } catch(err) {
        console.log(err.message)
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong!'
        });
    };
};

exports.deliveredOrder = async(req, res) => {
    try {
        const { orderId } = req.params;
        const vendorId = req.user._id;
        const order = await Order.findById(orderId);
        order.isDelevered = true;
        order.save({})
        console.log('Order now delivered!');

        if(order.isDelevered && order.isRecieved) {
            const completed = await completedOrder(req, res, order, vendorId);
            console.log('i was logged', completed)

            res.status(200).json({
                status: 'success',
                message: 'Order completed!',
                data: {
                    completed,
                }
            });
        } else {
            return res.status(200).json({ 
                status: 'success',
                message: 'Order now delivered!'
            });
        }

    } catch(err) {
        console.log(err.message)
        res.status(400).json({
            status: 'fail',
            message: err.message || 'Something went wrong!'
        });
    };
};



/*
onst UpdateAffiliateLink = await AffiliateLink.findOneAndUpdate(
            { affiliate: affiliate._id, product: completedOrder.product._id },
            { $inc: { purchase: 1 } },
            { new: true }
        );

        const completionOfOrderNotification = await Notification.create({
            user: buyer._id,
            message: `Your order for ${completedOrder.quantity} quantit${completedOrder.quantity > 1 ? 'ies' : 'y'} of ${product.name}  has been completely delivered!`,
            notifiedAt: formattedDate
        });

        affiliate.pendingAmountWallet -= completedOrder.affiliateCommission;
        affiliate.availableAmountWallet += completedOrder.affiliateCommission;
        affiliate.totalAmountWallet += completedOrder.affiliateCommission;
        affiliate.productSold = completedOrder.quantity;
        vendor.pendingAmountWallet -= completedOrder.vendorProfit;
        vendor.availableAmountWallet += completedOrder.vendorProfit;
        vendor.totalAmountWallet += completedOrder.vendorProfit;
        completedOrder.orderStatus = 'delivered';
        completedOrder.isDelevered = true;
        await completedOrder.save();
        await vendor.save({ validateBeforeSave: false });
        await affiliate.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            message: 'Order completed',
            data: {
                UpdateAffiliateLink,
                completionOfOrderNotification
            }
        });

*/


// exports.OrdersAndPayment = async (req, res) => {
//     try {
//         // Fetch the product information from the database
//         const { reference } = req.params;
//         const affiliate = await User.findOne({ slug: req.params.userSlug });
//         const product = await Product.findOne({ slug: req.params.productId });
//         if(!product) return res.status(404).json({ message: 'Product Not Found!' });

//         // come back to remodify the buyers
//         const buyer = await User.findById(req.user._id);
    
//         const orderInfo = {
//             quantity: req.body.quantity,
//             address: req.body.address,
//         };
//         const paymentData = {
//             email: req.body.email,
//             fullname: req.body.fullname,
//             amount: req.body.amount,
//         }

//         // Call the payment processing function
//         await processPayment(totalAmount, paymentData, orderInfo, product, buyer, res, affiliate);
         
//         const order = await Order.create({
//             product: product._id,
//             vendor: product.vendor,
//             buyer: buyer._id,
//             affiliate: affiliate._id,
//             vendorProfit: totalAmount - product.commissionAmount - charges,
//             affiliateCommission: product.commissionAmount,
//             amount: totalAmount,
//             ...orderInfo,
//             createdAt: this.formattedCreatedAt
//         });
    
//         res.status(200).json({
//             status: 'success',
//             message: 'Transaction completed successfully',
//             data: {
//                 newOrder: order,
//             }
//         });
        
//     } catch (error) {
//         res.status(500).json({ status: 'fail', message: 'Internal server error' });
//     }
// }

// /*
// exports.initializePayment = {
//     acceptPayment: async(req, res) => {
//       try {
//         // request body from the clients
//         const email = req.body.email;
//         const amount = req.body.amount;
//         // params
//         const params = JSON.stringify({
//           "email": email,
//           "amount": amount * 100
//         })
//         // options
//         const options = {
//           hostname: 'api.paystack.co',
//           port: 443,
//           path: '/transaction/initialize',
//           method: 'POST',
//           headers: {
//             Authorization: process.env.PAYSTACK_SECCRET_API_KEY, 
//             'Content-Type': 'application/json'
//           }
//         }
//         // client request to paystack API
//         const clientReq = require('https').request(options, apiRes => {
//           let data = ''
//           apiRes.on('data', (chunk) => {
//             data += chunk
//           });
//           apiRes.on('end', () => {
//             console.log(JSON.parse(data));
//             return res.status(200).json(data);
//           })
//         }).on('error', error => {
//           console.error(error)
//         })
//         clientReq.write(params)
//         clientReq.end()
        
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred' });
//       }
//     },
// }*/

// /*
// exports.pay = async (req, res, next) => {
//     try {
//       res.render("pay");
//     } catch (e) {
//       return next(new ErrorResponse(e.message, 500));
//     }
// }

// exports.errorPage = async(req, res, next) => {
//     try {
//       res.render("error");
//     } catch (e) {
//       return next(new ErrorResponse(e.message, 500));
//     }
// }

// exports.successPage = async(req, res, next) => {
//     try {
//       res.render("success");
//     } catch (e) {
//       return next(new ErrorResponse(e.message, 500));
//     }
// }
// */

// // product-default.png
// const processPayment = async (amount, paymentData, orderInfo, product, buyer, res, affiliate) => {
//     const form = _.pick(paymentData, ["amount", "email", "fullname"]);
//     form.metadata = {
//         full_name: form.full_name,
//     };
//     form.amount *= 100;
  
//     initializePayment(form, (error, body) => {
//         if (error) {
//             //handle errors
//             console.log(error);
//             return res.redirect("/error");
//         }
    
//         response = JSON.parse(body);
//         console.log(response);
//         res.redirect(response.data.authorization_url);
//     });
  
//     const verifyPayment = async (req, res, next) => {
//         const session = await require('mongoose').startSession();
//         session.startTransaction();
    
//         try {
//             const ref = req.query.reference;
//             verifyPayment(ref, async (err, body) => {
//                 if (err) {
//                     console.log(err);
//                     return res.redirect("/error");
//                 }

//                 response = JSON.parse(body);

//                 affiliate.pendingAmountWallet += product.commissionAmount;
//                 affiliate.productSold += 1;
//                 product.ordersCount += 1;
//                 product.profits += paidAmount - product.commissionAmount;
//                 // product.vendor.pendingAmountWallet += paidAmount - product.commissionAmount;
//                 product.vendor.pendingAmountWallet = product.profits;
//                 product.purchasesCount += 1;
//                 // pendingAmountWallet

//                 await product.save();
//                 await affiliate.save({ validateBeforeSave: false });
                

//                 const commission = await Commissions.create({
//                     product: product._id,
//                     affiliate: affiliate._id,
//                     commissions: product.commissionAmount,
//                     status: 'pending',
//                     createdAt: this.formattedCreatedAt
//                 });

//                 const UpdateAffiliateLink = await AffiliateLink.findByIdAndUpdate(
//                     { affiliate: affiliate._id, product: product._id }, 
//                     { purchases: this.purchases += product.commissionAmount },
//                     { new: true }
//                 )

//                 const orderTransaction = await Transaction.create({
//                     affiliate: affiliate._id,
//                     trnxType: "CR",
//                     purpose: "order",
//                     amount: amount,
//                     }, { session }
//                 );

//                 return res.status(200).json({
//                     status: 'success',
//                     data: {
//                         commission,
//                         affiliatePerofmance,
//                         orderTransaction,
//                         UpdateAffiliateLink
//                     }
//                 }).redirect("/success");
//             });
//             session.commitTransaction();
//         } catch (error) {
//             session.abortTransaction();
//             return res.redirect("/error");
//         }
//     };
// };
  
        
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

