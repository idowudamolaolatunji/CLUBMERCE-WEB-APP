const User = require('../model/usersModel')
const Product = require('../model/productsModel')

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
exports.affiliateDashboard =  (req, res, next) => {
    const user =  User.findOne();

    res.status(200).render('affiliate_dashboard', {
        user: user,
        title: `${user.name}'s dashboard`
    });
    next()
}
exports.reportPerformance = (req, res) => {
    res.status(200).render('report_performance');
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
exports.profile = (req, res) => {
    res.status(200).render('profile');
}
exports.transaction = (req, res) => {
    res.status(200).render('transaction');
}
exports.settings = (req, res) => {
    res.status(200).render('setting');
}
exports.notification = async (req, res) => {
    res.status(200).render('notification', {
        title: 'Your Notification'
    })
}
exports.vendorDashboard = async (req, res) => {
    res.status(200).render('vendor_dashboard', {
        title: 'Vendor Dashboard'
    })
}