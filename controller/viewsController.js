const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const app = require('../app');
const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const Commissions = require('../model/commissionModel');
const AffiliateLink = require('../model/affiliteLinkModel');
const Transaction = require('../model/transactionModel');
const Order = require('../model/orderModel');
const Notification = require('../model/notificationModel');

// Global
let token;
exports.home = (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('home', {
        title: 'Official Website',
        section: 'home',
        active: 'home',
        token
    });
}
exports.getStarted = (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('get-started', {
        title: 'Get Started',
        active: 'get-started',
        token
    });
}
exports.vendor = (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('vendor', {
        title: 'Become a vendor',
        active: 'vendor',
        token
    });
}
exports.affiliate = (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('affiliate', {
        title: 'Become an affiliate',
        active: 'affiliate',
        token
    });
}
exports.contactUs = (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('contact-us', {
        title: 'Contact Us',
        active: 'contact us',
        token
    });
}
exports.login = async (req, res) => {
    if( req.cookies?.jwt ) {
        return res.redirect('/dashboard')
    }
    res.status(200).render('login', {
        title: 'Login your account',
        active: 'login'
    })
}
exports.verified = async (req, res) => {
    if( req.cookies.jwt ) token = req.cookies.jwt;
    res.status(200).render('verified', {
        title: 'Email Successfully Verified',
        token
    })
}


// visitors / buyers
exports.paymentForm = (req, res) => {
    res.status(200).render('payment');
}
exports.getOrderProductPage = async(req, res) => {
    res.status(200).render('order_product');
}
exports.buyerLoginAuth = (req, res) => {
    res.status(200).render('buyer_login');
}
exports.buyerSignupAuth = (req, res) => {
    res.status(200).render('buyer_signup');
}

// Affiliates
exports.marketPlace = async (req, res) => {
    try {
        const products = await Product.find().sort({ isBoosted: -1, createdAt: -1, productGravity: -1, purchasesCount: -1 });

        res.status(200).render('marketplace', {
            title: 'Affiliate marketPlace',
            products,
            section: 'marketplace'
        });
    } catch(err) {
        res.status(400).json({message: err})
    }
}
exports.getProduct = async (req, res) => {
    try {
        // 1) Get the data, for the requested product
        const product = await Product.findOne({ slug: req.params.slug })
        if (!product) {
            return res.json({message: 'There is no product with that name.'})
        }
        // 2) Build template
        // 3) Render template using data from 1)
        res.status(200).render('product', {
            title: product.name,
            product
        });
    } catch(err) {
        res.status(400).json({message: err});
    }
}

// common routes
exports.dashboard = async (req, res) => {
    try {
        // console.log(req)
        const user = await User.findById(req.user._id);
        const products = await Product.find({ vendor: req.user._id });
        const commissions = await Commissions.find({ affiliate: req.user._id});
        const recieviedOrders = await Order.find({ vendor: req.user._id });
        const requestingOrders = await Order.find({ buyer: req.user._id });
        const notifications = await Notification.find({ user: user.id });

        const allUsers = await User.find();
        const allProducts = await Product.find();
        const allOrders = await Order.find();

        const totalClicks = allUsers.reduce((total, user) => total + user.clicks, 0);
        const totalPurchases = allProducts.reduce((total, product) => total + product.purchasesCount, 0);
        
        res.status(200).render('base_account', {
            user,
            products,
            commissions,
            recieviedOrders,
            requestingOrders,
            notifications,

            allProducts,
            allUsers,
            allOrders,
            totalClicks,
            totalPurchases,

            title: `${user.role}'s dashboard`,
        });
    } catch (err) {
        res.json({message: 'No user with this Id'});
    }
}
exports.profile = (_, res) => {
    res.status(200).render('profile');
}
exports.settings = (_, res) => {
    res.status(200).render('setting');
}
exports.performance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const affiliatePerformance = await AffiliateLink.find({ affiliate: req.user._id })
        const products = await Product.find({ vendor: req.user._id });
        res.status(200).render('performance', {
            title: 'Your perfomance',
            products,
            user,
            affiliatePerformance
        });
    } catch(err) {
        console.log(err)
    }
}
exports.transaction = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });
        const user = await User.findById(req.user._id);

        res.status(200).render('transaction', {
            title: 'Your Transactions',
            transactions,
            user
        });
    } catch(err) {
        console.log(err)
    }
}


exports.leaderboard = async(req, res) => {
    try {
        const affiliateLeaderboard = await User.find({ role: 'affiliate'}).sort({ totalAmountWallet: -1, promotionLinksCounts: -1, clicks: -1 });
        const vendorLeaderboard = await User.find({ role: 'vendor'}).sort({ totalAmountWallet: -1});
        const currentUser = await User.findById(req.user._id);
        const vendorProducts = await Product.find()

        res.status(200).render('leaderboard', {
            title: `${'v'} Leaderboards`,
            affiliateLeaderboard,
            vendorLeaderboard,
            currentUser,
            vendorProducts
        });
    } catch(err) {
        res.status(400).json({message: err});
    }
}



// Vendors
exports.signupVendor = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create a vendor account'
    });
}
exports.productCatalog = async(req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id })
        
        res.status(200).render('product_catalog', {
            title: 'Your Product',
            products,
        })
    } catch(err) {
        res.json({message: 'You dont have any product'});
    }
}
exports.upgrade = (req, res) => {
    res.status(200).render('upgrade');
}


// Admin
exports.adminAuth = (req, res) => {
    res.status(200).render('admin_login');
}

exports.manageUsers = async (req, res) => {
    try {
        const users = await User.find({ role: {"$ne": 'admin'} }).sort('-createdAt').select('+active');
        res.status(200).render('manage_users', {
            title: 'All Users',
            users
        })
    } catch(err) {
        res.json({message: 'There is no user yet!'});
    }
}
exports.manageProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).render('manage_products', {
            title: 'All Products',
            products
        })
    } catch(err) {
        res.json({message: 'There is no user yet!'});
    }
}
exports.managePayments = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).render('manage_payments', {
            title: 'All Transactions',
            transactions
        });
    } catch(err) {
        res.json({message: 'There is no user yet!'});
    }
}
exports.manageOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort('-createdAt');
        res.status(200).render('manage_orders', {
            title: 'All Orders',
            orders
        });
    } catch(err) {
        res.json({message: 'There is no user yet!'});
    }
}
exports.manageAds = (req, res) => {
    res.status(200).render('manage_ads', {
        title: 'Manage Ads',
    });
   
}
exports.manageApp = (req, res) => {
    res.status(200).render('manage_app', {
        title: 'Global Settings',
    });
   
}

exports.getOrderPage = async (req, res) => {
    try {
        let token;
        if(req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        const { username, productSlug } = req.params;
        const affiliate = await User.findOne({ username });
        const product = await Product.findOne({ slug: productSlug });
        res.status(200).render('order_product', {
            title: 'Order ',
            product,
            affiliate,
            // user,
            token
        });
    } catch(err) {
        res.json({message: err});
    }
}