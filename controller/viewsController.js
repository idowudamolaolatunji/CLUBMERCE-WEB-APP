const User = require('../model/usersModel')
const Product = require('../model/productsModel')
const Commissions = require('../model/commissionModel') 
const Transaction = require('../model/transactionModel') 

// Global
exports.home = (req, res) => {
    res.status(200).render('home', {
        title: 'Official Website',
        active: true
    });
}
exports.getStarted = (req, res) => {
    res.status(200).render('get-started', {
        title: 'Get Started',
        active: true
    });
}
exports.vendor = (req, res) => {
    res.status(200).render('vendor', {
        title: 'Become a vendor',
        active: true
    });
}
exports.affiliate = (req, res) => {
    res.status(200).render('affiliate', {
        title: 'Become an affiliate',
        active: true
    });
}
exports.login = async (req, res) => {
    res.status(200).render('login', {
        title: 'Login your account',
        active: true
    })
}
exports.signUp = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create an account'
    });
}

// visitors
exports.paymentForm = (req, res) => {
    res.status(200).render('payment');
}
exports.getOrderProductPage = async(req, res) => {
    res.status(200).render('order_product', token);
}

// Affiliates
exports.marketPlace = async (req, res) => {
    try {
        const products = await Product.find();

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
        res.status(400).json({message: err})
    }
}

// common routes
exports.dashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const products = await Product.find({ vendor: req.user._id });
        const commission = await Commissions.find({ user: req.user.id})

        res.status(200).render('base_account', {
            user,
            products,
            commission,
            title: `${user.role}'s dashboard`,
        });
    } catch (err) {
        res.json({message: 'No user with this Id'});
    }
}
exports.profile = (req, res) => {
    res.status(200).render('profile');
}
exports.settings = (req, res) => {
    res.status(200).render('setting');
}
exports.performance = async (req, res) => {
    try {
        // const user = await User.findById(req.locals.user.id);
        // const products = await Product.find({ vendor: req.locals.user._id });
        console.log('perfomace request:', req)
        res.status(200).render('performance', {
            title: 'Your perfomance',
            // user,
            // products,
        });
    } catch(err) {
        console.log(err)
    }
}
exports.transaction = (req, res) => {
    res.status(200).render('transaction');
}

// Vendors
exports.productCatalog = async(req, res) => {
    try {
        const products = await Product.find({ vendor: req.user._id });
        console.log(products)
        
        res.status(200).render('product_catalog', {
            title: 'Your Product',
            products
        })
    } catch(err) {
        res.json({message: 'You dont have any product'});
    }
}

// Admin
exports.adminAuth = (req, res) => {
    res.status(200).render('admin_auth');
}

exports.productMarketplace = (req, res) => {
    res.status(200).render('product_marketplace-admin');
}
exports.manageUsers = async (req, res) => {
    try {
        const users = await User.find();
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
exports.managePayment = async (req, res) => {
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