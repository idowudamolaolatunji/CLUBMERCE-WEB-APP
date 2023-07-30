const multer = require('multer');
const sharp = require('sharp');

const cloudinary = require('cloudinary').v2

const app = require('../app');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../model/usersModel');

////////////////////////////////////////////////
////////////////////////////////////////////////

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});



exports.getMe = (req, res, next) => {
    // this middleware gives us access to the current user
    req.params.id = req.user.id;
    next();
};

exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route is not defined! Please use /signup instead'
    });
    return req.redirect('/signup');
};

exports.getAllUser = async(req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            status: "success",
            data: {
                count: users.length,
                users,
                // count: await User.find().countDocuments()
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            error: err.message
        })
    }
};

exports.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                user,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err.message,
        })
    }
};

/////////////////////////////////////////////////

exports.updateUser = async(req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: "success",
            data: {
                user,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
        })
    }
};
/////////////////////////////////////////////////

exports.deleteUser = async(req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);

        res.status(200).json({
            status: "success",
            data: null
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message,
        })
    }
};


////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// update current user data
const NewObj = {}
const filterObj = function(obj, ...allowedFileds) {
	Object.keys(obj).forEach(el => {
		if(allowedFileds.includes(el)) NewObj[el] = obj[el]
	});
    return NewObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // create an error if user POST's password data.
    if(req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }
    // Validate and upload the image to Cloudinary
    if (!req.file || req.file.size > 10 * 1024 * 1024) {
        // Limit image size to 10MB
        return res.status(400).json({ error: 'Invalid image file or size exceeds 10MB' });
      }
      const mainImageResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'product_main_images',
      });
      
    // update user documents
    // 1. filter
    const allowedFileds = [fullName, email, country, phone, state, cityRegion, zipPostal, image];
    const body = { ...req.body, image: mainImageResult.secure_url }
    const filterBody = filterObj(body, allowedFileds);
    // 2. update
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
});

exports.updateBankDetails = catchAsync(async (req, res, next) => {
    
    // update user bank details
    // 1. filter
    const allowedFileds = [bankName, bankAccountNumber, holdersName];
    const filterBody = filterObj(req.body, allowedFileds);
    // 2. update
    const updatedDetails = await User.findByIdAndUpdate(req.user.id, filterBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: {
            userDetails: updatedDetails
        }
    })
});

// delete current user
exports.deleteAccount = catchAsync(async (req, res, next) => {
        // get user
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: "success",
        data: null
    })
});