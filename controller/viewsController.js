const User = require('../model/usersModel')
const Product = require('../model/productsModel')

exports.home = (req, res) => {
    res.status(200).render('home', {
        title: 'Official Website'
    });
}
exports.getStarted = (req, res) => {
    res.status(200).render('get-started', {
        title: 'Get Started'
    });
}
exports.vendor = (req, res) => {
    res.status(200).render('vendor', {
        title: 'Become a vendor'
    });
}
exports.affiliate = (req, res) => {
    res.status(200).render('affiliate', {
        title: 'Become an affiliate'
    });
}
// exports.login = (req, res) => {
//     res.status(200).render('login', {
//         title: 'Sign into your account'
//     });
// }
exports.signUp = (req, res) => {
    res.status(200).render('signup', {
        title: 'Create an account'
    });
}
exports.dashboard =  (req, res, next) => {
    const user =  User.findOne();

    res.status(200).render('dashboard', {
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
    res.status(200).render('login', {
        title: 'Login your account'
    })
}
exports.notification = async (req, res) => {
    res.status(200).render('notification', {
        title: 'Your Notification'
    })
}
exports.directMessage = async (req, res) => {
    res.status(200).render('direct_message', {
        title: 'Your Direct Message'
    })
}