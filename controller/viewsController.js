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

exports.dashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).render('base_account', {
            user: user,
            title: `${user.role}'s dashboard`
        });
    } catch (err) {
        res.json({message: 'No user with this Id'})
    }
}

// Affiliates
exports.affiliatePerformance = (req, res) => {
    res.status(200).render('affiliate_performance');
}
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
        // 1) Get the data, for the requested product (including reviews and guides)
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
