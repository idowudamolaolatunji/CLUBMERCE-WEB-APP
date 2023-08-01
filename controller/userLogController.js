const {promisify} = require('crypto');

const User = require('../model/usersModel')
const UserLog = require('../model/userLogModel')


exports.createUserLogs = async (req, res) => {
  try {
    const productSlug = req.params.productSlug;
    const affiliate = req.params.user;
    console.log(affiliate)
    // const token = req.headers.authorization.split(' ')[1] || req.cookies.jwt;
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if(!token) {
      // Popup a sign-up modal or handle the scenario for non-signed up users
      // ...
      return res.render('signup-modal');
    }

    const decoded = await promisify(jwt.verify)(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN);
    const userId = await User.findById(decoded.id);

    // Check if a user log already exists for the current user, product, and affiliate
    const existingLog = await UserLog.findOne({
      userId,
      productSlug,
      affiliateId: req.params.user // Assuming you have a user object in the request with affiliateId property
    });

    if (!existingLog) {
      // Create a new user log
      const newLog = new UserLog({
        userId,
        affiliateId: req.params.user,
        productId: product._id, // Assuming you have a product object based on the productSlug
        expiresAt: new Date().setHours(23, 59, 59), // Set the expiry date to the end of the current day
      });
      await newLog.save();
    }

    // Render the order page
    res.render('order');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

