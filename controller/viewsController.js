const User = require('../model/usersModel')
const Product = require('../model/productsModel')

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
exports.dashboard = async (req, res, next) => {
    try {
        const user = await User.findOne();

        res.status(200).render('base_account', {
            user: user,
            title: `${user.name}'s dashboard`
        });
        next()
    } catch (err) {
        next(err)
    }
    next();
}

// Affiliates
// exports.affiliateDashboard =  (req, res, next) => {
//     const user =  User.findOne();

//     res.status(200).render('affiliate_dashboard', {
//         user: user,
//         title: `${user.name}'s dashboard`
//     });
//     next()
// }
exports.affiliatePerformance = (req, res) => {
    res.status(200).render('affiliate_performance');
}
exports.marketPlace = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).render('marketplace', {
            title: 'marketPlace',
            products,
            section: 'marketplace'
        });
    } catch(err) {
       next(err)
    }
}

exports.product = async (req, res, next) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })

        if(!product) return next('No product with that name')
        res.status(200).render('product', {
            title: product.name,
            product
        });
    } catch(err) {
        next(err)
    }
}
exports.affiliateTransaction = (req, res) => {
    res.status(200).render('affiliate_transaction');
}

// common routes
exports.profile = (req, res) => {
    res.status(200).render('profile');
}
exports.settings = (req, res) => {
    res.status(200).render('setting');
}
exports.notification = (req, res) => {
    res.status(200).render('notification', {
        title: 'Your Notification'
    })
}

// Vendors
// exports.vendorDashboard = (req, res) => {
//     res.status(200).render('vendor_dashboard', {
//         title: 'Vendor Dashboard'
//     })
// }
exports.vendorPerformance = (req, res) => {
    res.status(200).render('vendor_performance', {
        title: 'Product Perfomance'
    })
}
exports.vendorTransaction = (req, res) => {
    res.status(200).render('vendor_transaction', {
        title: 'Transaction'
    })
}
exports.productCatalog = (req, res) => {
    res.status(200).render('product_catalog', {
        title: 'Your Product'
    })
}

// Admin
exports.adminAuth = (req, res) => {
    res.status(200).render('admin_auth');
}
exports.allPerformance = (req, res) => {
    res.status(200).render('all_performance', {
        title: 'Clubmerce Admin Dashboard'
    })
}
exports.productMarketplace = (req, res) => {
    res.status(200).render('product_marketplace-admin');
}
exports.adminSettings = (req, res) => {
    res.status(200).render('admin_setting');
}
exports.manageUsers = (req, res) => {
    res.status(200).render('manage_users')
}
exports.manageProducts = (req, res) => {
    res.status(200).render('manage_products')
}
exports.managePayment = (req, res) => {
    res.status(200).render('manage_payment')
}
