const multer = require('multer');
const sharp = require('sharp');


const app = require('../app');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('../model/usersModel');

////////////////////////////////////////////////
////////////////////////////////////////////////

// const cloudinary = require('cloudinary').v2
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_SECRET,
// });

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         // define the destination
//         cb(null, 'public/asset/img/users')
//     },
//     filename: (req, file, cb) => {
//         // give file some unique file name (user-id(73sfr343e73)-timestamp(747448382).jpeg)
//         const extention = file.mimetype.split('/')[1];
//         cb(null, `user-${req.user.id}-${Date.now()}.${extention}`);
//     }
// });

const multerStorage = multer.memoryStorage()

// create a multer filter
const multerFilter = (req, file, cb) => {
    // the goal is to check that the uploaded file is an image, and if true, we would then pass true into the callback fn and if not we pass false with an error
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.userPhotoUpload = upload.single('image');

// middleware that helps resize images
exports.resizeUserImage = catchAsync(async (req, res, next) => {
    if(!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/asset/img/users/${req.file.filename}`);
    next();
});

exports.uploadProfilePicture = async (req, res) => {
    try {
        console.log(req.body, req.file, req.files);

        let image;
        if(req.file) image = req.file.filename;
        const updatedImage = await User.findByIdAndUpdate(req.user._id, {image: image}, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: 'success',
            data: {
                image: updatedImage.image
            }
        });
    } catch(err) {
        console.log(err)
    }
}



exports.getMe = (req, res, next) => {
    // this middleware gives us access to the current user
    req.params.id = req.user._id;
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
const filterObj = function(obj, ...allowed) {
	Object.keys(obj).forEach(el => {
		if(allowed.includes(el)) NewObj[el] = obj[el];
	});
    return NewObj;
}

exports.updateMe = catchAsync(async (req, res, next) => {
    // create an error if user POST's password data.
    if(req.body.password || req.body.passwordConfirm) {
        return next( new AppError('This route is not for password updates. Please use /updateMyPassword.', 400));
    }
    
    // update user documents
    // // 1. filter
    // const allowedFileds = [fullName, email, country, phone, state, cityRegion, zipPostal];
    // const filterBody = filterObj(req.body, allowedFileds);
    // console.log(filterBody)


    // 2. update
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
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
    // // 1. filter
    // const allowedFileds = [bankName, bankAccountNumber, holdersName];
    // const filterBody = filterObj(req.body, allowedFileds);
    // 2. update
    const updatedDetails = await User.findByIdAndUpdate(req.user.id, req.body, {
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
exports.deleteAccount = async(req, res, next) => {
    try {
        // get user
        await User.findByIdAndUpdate(req.user._id, { active: false });

        res.cookie('jwt', '', {
            expires: new Date(Date.now() + 10 * 500),
            httpOnly: true
          }).clearCookie('jwt')
        return res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err) {
    console.log(err)
    }
};
  

/*
add subscriptiontype and productCataloglength to the model

if venndor.subcriptiontype === free
    venndor.productCataloglength === 10
if venndor.subcriptiontype === standard
    venndor.productCataloglength === 50
if venndor.subcriptiontype === premium
    venndor.productCataloglength === unlimited
*/