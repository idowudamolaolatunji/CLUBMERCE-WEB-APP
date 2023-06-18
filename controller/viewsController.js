const User = require('../model/usersModel')
const Product = require('../model/productsModel')

exports.home = (req, res) => {
    res.status(200).render('home', {
        title: 'Official Website'
    });
}
exports.getStarted = (req, res) => {
    res.status(200).render('get-started');
}
exports.vendor = (req, res) => {
    res.status(200).render('vendor');
}
exports.affiliate = (req, res) => {
    res.status(200).render('affiliate');
}
exports.login = (req, res) => {
    res.status(200).render('login');
}
exports.signUp = (req, res) => {
    res.status(200).render('signup');
}
exports.dashboard =  (req, res, next) => {
    const user =  User.findOne();

    res.status(200).render('dashboard', {
        user: user,
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
            products,
            section: 'marketplace'
        });
    } catch(err) {
       next(err)
    }
}
exports.product = (req, res) => {
    res.status(200).render('product');
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

exports.login = async (req, res) => {
    
}