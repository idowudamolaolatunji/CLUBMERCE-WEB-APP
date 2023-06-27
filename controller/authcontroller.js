const { promisify } = require('util');
const crypto = require('crypto')

const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser')

const app = require("./../app");
const User = require("./../model/usersModel");
const sendEmail = require('../utils/Email')


////////////////////////////////////////////////
////////////////////////////////////////////////
const signToken = (id) => {
    // takes the user id(payload), secretkey, and an option(expiredin)
  return jwt.sign({ id: id }, process.env.CLUBMERCE_JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}


const createCookie = function(statusCode, user, res, message) {
  // takes the user id(payload), secretkey, and an option(expiredin)
  const token = signToken(user._id);

  const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
  }
  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookies('jwt', token, cookieOptions);

  res.status(200).json({
    status: "success",
    message: "Successfully logged in",
    token,
    data: {
      user
    }
  });
}


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
// signup
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      username: req.body.username,
      country: req.body.country,
      phone: req.body.phone,
      role: req.body.role,
    });

    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
      data: {
        user: newUser
      }
    });

  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err,
    })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { email, password, role} = req.body;
    const user = await User.findOne({email}).select('+password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!user || !isMatch) {
      return res.status(404).json({
        status: "fail",
        message: "email or password incorrect",
      });
    }
    //=//=//=//=//=//=//=//=//=//
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookie('jwt', token, cookieOptions);
    //=//=//=//=//=//=//=//=//=//

    // Remove password from output
    user.password = undefined;

    res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      // token,
      data: {
        user,
      }
    })

  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};


// logout
// exports.logout = (req, res) => {
//   res.cookie('jwt', 'loggedout', {
//     expires: new Date(Date.now() + 2 * 1000),
//     httpOnly: true
//   });
//   res.status(200).json({ status: 'success' });
// };

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ status: 'success' });
};


// protect
exports.protect = async (req, res, next) => {
  // remember you will have to get the token from the req.header...
  // also remember that u can access the user id (payload) directly from the token, also the expired time and the issued time 
  try {
    // get token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }  else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if(!token)
      return next('You are not authorised')

    // verify token, by decoding jwt
    const decoded = await promisify(jwt.verify)(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN);

    // check if that user still exist, by finding this user
    const userExist = await User.findById(decoded.id);
    if(!userExist)
      return next('user doesnt exist');
      
    // check if user changed password after token was issued (much complex, but use the instance function in the model)
    if(userExist.changedPasswordAfter(decoded.iat)) {
      return next('User recently changed password, Please login again')
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();

  } catch(err) {
    res.status(400).json({
      status: "fail",
      message: err,
    })
  }
  next();
}

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if(!token)
      return next('You are not loggedin')
    // 1) verify token
    const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.CLUBMERCE_JWT_SECRET_TOKEN);

    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next();
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // THERE IS A LOGGED IN USER
    res.locals.user = currentUser;
    return next();
  } catch (err) {
    return next();
  }
  next();
};

// RESTRICTED TO
// go to the schema and set enum for the types of user, and set a default to user
// (i.e an enum is like an array)
// remember a middleware function like this one, we usually cannot give an argument of our own
// but there is a way around it, by allowing the function act like a normal function and reurning a middleware function insde of it (i.e like a wrapper function).
exports.restrictedTo = function(...role) {
  return function(req, res, next) {
    // now pass in an abitrary amount of argument into the function
    if(!role.includes(req.user.role)) {
      return next('You do not have permission to perform this action');
    }
  // the check if what values are not included in the passed in argument (req.user)
	next();
  }
}

/* 
// forgot password
exports.forgotPassword = async (req, res, next) => {
	try {
		// get user based on posted email
		const {email} = req.body.email;
		const user = await User.findOne({email});

		// generate the random reset token
		const resetToken = user.createPasswordResetToken()
		user.save({ validateBeforeSave: false });

		// send to user's email
		const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
		const message = `Forgot password? Submit a request with your new Password and Password Confirm to: ${resetUrl}. \n If you didn't request this or forgot password, Please ignore this email!.`;

		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (Vaild for only 10mins)',
			message,
		});

		res.status(200).json({
			status: "success",
			message: "Token sent to email address"
		});
    console.log(user, user.passwordResetToken, user.passwordResetEpires)


	} catch(err) {
		user.passwordResetToken = undefined;
		user.passwordResetEpires = undefined;
		await user.save({ validateBeforeSave: false });
		return next(err);
	}
  next()
}

// reset password
exports.resetPassword = async (req, res, next) => {
	try {
		// get user based on token
		const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
		const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetEpires: { $gt: Date.now() }});

		// if token has not expired, there is a user, set new password
		if(!user) return next('Token is invalid or has expired');
		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetEpires = undefined;
		user.save();

		// update changedPasswordAt for the user
		// done in userModel on the user schema

		// login user, send jwt
		const token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookies('jwt', token, cookieOptions);

    res.status(200).json({
      status: "success",
      data: {
        user,
      }
    })

	} catch(err) {
		res.status(400).json({
			status: "fail",
			message: err.message
		})
	}
  next()
}

// Updating current logged in user password
exports.updatePassword = async (req, res, next) => {
	try {
		// get user 
		const user = await User.findById(req.user.id).select('+password');
		
		// check if POSTED current password is correct
		if(!await user.comparePassword(req.body.passwordCurrent, user.password)) {
			return next('Your current password is incorrect');
		}

		// if so, update user password
		user.passsword = req.body.passsword;
		user.passwordConfirm = req.body.passwordConfirm;
		await user.save();
		// User.findByIdAndUpdate, will not work here...

		// log user in, send jwt
		const token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    res.cookies('jwt', token, cookieOptions);

		res.status(201).json({
			status: "success",
			token,
			data: {
				user,
			}
		});
    next()

	} catch(err) {
		res.status(400).json({
			status: "fail",
			message: err.message
		})
	}
  next();
}

*/





/*

  well stuctured product schema, and product routes( CRUD: with the product controller fn )
  well organised user schema, and user routes( CRUD: with the user controller fn )
  password management and hashing/salting in the model
  auth controller for sign up, login
  jwt token for loging in authorization
  user signup / vendor signup (admin signup can only be created through the database not with any signup form)
  user login / vendor login / admin login 
  protected routes for only logged users (through jwt)
  retricted routes and actions to only logged in-permmitted and specific user type
  forgot password, and password reset (using nodemailer)
  current user profile update( password update, profile update: phone num, email, account details )
  rate limiting( to avoid attack or / and api over usage)
  vendors dashboard / affiliate dashboard
  

  ************LATER************
  
  payment integration
  vendor's dashboard products listing and catalog and reports 
  trackable and unique affliate link for promotion
  affliate dashboard reports and commission
  report mechnism, report system for recording commission and product

*/

// how many milliseconds in an hour