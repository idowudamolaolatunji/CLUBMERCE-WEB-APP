const { promisify } = require('util');
const crypto = require('crypto')

const express = require('express')
const jwt = require('jsonwebtoken');

const app = require("./../app");
const User = require("../model/usersModel");
const { confirmEmailTemplate, emailConfirmedTemplate } = require('../utils/EmailTemplates');
const sendEmail = require('../utils/Email');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// const nodemailer = require('nodemailer')
// const handleForm = require('../utils/Email.js')



////////////////////////////////////////////////
////////////////////////////////////////////////
const signToken = (id) => {
  // takes the user id(payload), secretkey, and an option(expiredin)
  return jwt.sign({ id: id }, process.env.CLUBMERCE_JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

/*
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
*/
// You’ve received this message because your email address has been registered with our site. Please click the button below to verify your email address and confirm that you are the owner of this account.


const sendSignUpEmailToken = async (_, user, token) => {
  try {
    // const verificationUrl = `${_.protocol}://${_.get('host')}/api/users/verify-email/${token}`;
    const verificationUrl = `https://clubmerce.com/api/users/verify-email/${token}`;
    const mailMessage = confirmEmailTemplate(user.fullName, verificationUrl);
    console.log(verificationUrl)
    await sendEmail({
      user: user.email,
      subject: 'Verify Your Email Address',
      message: mailMessage
    });

  } catch (err) {
    console.log(err);
  }
};


//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
// signup
exports.signupAffiliate = catchAsync(async (req, res) => {
    const emailExist = await User.findOne({email: req.body.email });
    const usernameExist = await User.findOne({username: req.body.username });
    if(emailExist) return res.json({ message: 'Email already Exist'});
    if(usernameExist) return res.json({ message: 'Username already Exist'});
    
    
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
    
    const token = signToken(newUser._id);
    res.status(201).json({
      status: "success",
      message: "Successfully signed up, Confirm Email",
      token,
      data: {
        user: newUser
      }
    });
    await sendSignUpEmailToken(req, newUser, token);
});

exports.signupVendor = catchAsync(async (req, res) => {
    const emailExist = await User.findOne({email: req.body.email });
    const usernameExist = await User.findOne({username: req.body.username });
    if(emailExist) return res.json({ message: 'Email already Exist'});
    if(usernameExist) return res.json({ message: 'Username already Exist'});
    
    const newUser = await User.create({
      businessName: req.body.businessName,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      username: req.body.username,
      country: req.body.country,
      phone: req.body.phone,
      role: req.body.role,
      vendorAccountType: req.body.type,
    });

    const token = signToken(newUser._id);
    
    res.status(201).json({
      status: "success",
      message: "Successfully signed up, Confirm Email",
      token,
      data: {
        user: newUser
      }
    });
    await sendSignUpEmailToken(req, newUser, token);
})
exports.signupBuyer = catchAsync(async (req, res) => {
    const emailExist = await User.findOne({email: req.body.email, role: 'buyer' });
    const usernameExist = await User.findOne({username: req.body.username, role: 'buyer' });
    if(emailExist) return res.json({ message: 'Email already Exist'});
    if(usernameExist) return res.json({ message: 'Username already Exist'});


    const newBuyer = await User.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        username: req.body.username,
        role: 'buyer',
        // isEmailVerified: true
    });

    const token = signToken(newBuyer._id);
    
    res.status(201).json({
      status: "success",
      message: "Successfully signed up",
      token,
      data: {
        user: newBuyer
      }
    });
    await sendSignUpEmailToken(req, newUser, token);
});


// Login
exports.login = catchAsync(async (req, res, next) => {
    const { email, password} = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if user exists rs&& password is correct
    const user = await User.findOne({ email }).select('+password');
    if(!user) return res.status(404).json({ message: 'User not found!' });
    if (!user.email || !(await user.comparePassword(password, user?.password)) ) {
        return res.status(400).json({message: 'Incorrect email or password'})
    }
    if(user?.active === false) {
      return res.status(404).json({ message: 'Account no longer active' });
    }

    //=//=//=//=//=//=//=//=//=//
    const token = signToken(user._id);
    
    if(user?.isEmailVerified === false) {
      const token = signToken(user._id);
      res.status(400).json({message: 'Email address not verified, Check your mail'})
      await sendSignUpEmailToken(req, user, token);
    }

    const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
        secure: true
    }
    res.cookie('jwt', token, cookieOptions);
    //=//=//=//=//=//=//=//=//=//
    
    // Remove password from output
    user.isLogIn = true;
    user.password = undefined;
    return res.status(200).json({
      status: "success",
      message: "Successfully logged in",
      token,
      data: {
          user,
      }
    });
});


// Verification route
exports.verifyEmail = async (req, res) => {
  try {
      // Verify the token
      const { token } = req.params
      const decoded = jwt.verify(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN);
  
      // Find the user based on the decoded token
      const user = await User.findById( decoded.id);
      console.log(user)
  
      if (user) {
          // Update the user's email verification status
          user.isEmailVerified = true;
          user.isLogIn = true;
          await user.save({ validateBeforeSave: false });

          const token = signToken(user._id);
          const cookieOptions = {
            expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true
          }
          res.cookie('jwt', token, cookieOptions);

          res.redirect('/email-verifed/success');
          const destinationUrl = `${user.role === 'buyer' ? 'https://clubmerce.com/buyers/dashboard' : 'https://clubmerce.com/dashboard'}`;
          const mailMessage = emailConfirmedTemplate(user.fullName, destinationUrl);
          await sendEmail({
            user: user.email,
            subject: 'Email Verification Success!',
            message: mailMessage
          });

      } else {
          // Handle user not found error
          res.status(404).json({ message: 'User not found' });
        }
  } catch (err) {
    // Handle invalid token or other errors
    console.log(err)
    res.status(400).json({status: 'fail', message: 'Invalid token' });
  }
};


// Login buyers
exports.loginBuyer = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user.email || !(await user.comparePassword(password, user.password))) {
        res.json({message: 'Incorrect email or password'})
    }
    
    const token = signToken(user._id);
    if(user?.isEmailVerified === false) {
      const token = signToken(user._id);
      res.status(400).json({message: 'Email address not verified, Check your mail'})
      await sendSignUpEmailToken(req, user, token);
    }
    
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true
    }
    user.isLogIn = true;
    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;
    return res.status(200).json({
        status: "success",
        message: "Successfully logged in",
        token,
        data: {
            user,
        }
    })
  });
exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password} = req.body;

  if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists rs&& password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user.email || !(await user.comparePassword(password, user.password)) || user.role !== 'admin') {
      return next(new AppError('Incorrect email or password or role', 401));
  }
  //=//=//=//=//=//=//=//=//=//
  const token = signToken(user._id);
  const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true
  }
  res.cookie('jwt', token, cookieOptions);
  //=//=//=//=//=//=//=//=//=//

  // Remove password from output
  user.password = undefined;

  return res.status(200).json({
    status: "success",
    token,
    data: {
        user,
    }
  })
});


// logout
// exports.logout = (_, res) => {
//   res.clearCookie("jwt");
//   res.status(200).json({ status: 'success' });
// };
exports.logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    const decokedTokenId = await jwt.verify(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN).id;
    const user = await User.findById(decokedTokenId);
    user.isLogIn = false;
    user.save({ validateBeforeSave: false })
    res.clearCookie("jwt");
    res.status(200).json({ status: 'success' });
  } catch(err) {
    console.log(err)
  }
};




// protect 
exports.protect = catchAsync(async (req, res, next) => {
    // remember you will have to get the token from the req.header...
  // also remember that u can access the user id (payload) directly from the token, also the expired time and the issued time 

  // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        res.redirect('/login')
        return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.CLUBMERCE_JWT_SECRET_TOKEN);
    req.user = {
      id: decoded.id,
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401 )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
        new AppError('User recently changed password! Please log in again.', 401)
        );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
});



// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.CLUBMERCE_JWT_SECRET_TOKEN
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        res.redirect('/login')
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      req.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }

  // No token found
  next();
};


// RESTRICTED TO
// go to the schema and set enum for the types of user, and set a default to user
// (i.e an enum is like an array)
// remember a middleware function like this one, we usually cannot give an argument of our own
// but there is a way around it, by allowing the function act like a normal function and reurning a middleware function insde of it (i.e like a wrapper function).
exports.restrictedTo = catchAsync(async function(...role) {
  return function(req, res, next) {
    // now pass in an abitrary amount of argument into the function
    if(!role.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
  // the check if what values are not included in the passed in argument (req.user)
  }
  next();
});

// forgot password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/users/resetPassword/${resetToken}`;
  const resetURL = `https://clubmerce.com/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});


// reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetEpires: { $gt: Date.now() }});

  // if token has not expired, there is a user, set new password
  if(!user) return next(new AppError('Token is invalid or has expired', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetEpires = undefined;
  await user.save();

  // update changedPasswordAt for the user
  // done in userModel on the user schema

  // login user, send jwt
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true
  }
  res.cookies('jwt', token, cookieOptions);

  return res.status(200).json({
    status: "success",
    data: {
      user,
    }
  })
})

/*
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    // const resetURL = `$https://clubmerce.com/api/v1/users/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
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
});
*/

// Updating current logged in user password
exports.updatePassword = async (req, res) => {
  try {
      // get user 
    const user = await User.findById(req.user.id).select('+password');
    
    // check if POSTED current password is correct
    if(!await user.comparePassword(req.body.passwordCurrent, user.password)) {
      return res.json({ message: 'Your current password is wrong.' });
    }

    // if so, update user password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save({ validateModifiedOnly: true });
    // User.findByIdAndUpdate, will not work here...

    // log user in, send jwt
    const token = signToken(user._id);
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true
    }
    res.cookie('jwt', token, cookieOptions);

    return res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      }
    });
  } catch(err) {
    console.log(err)
    return res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};
