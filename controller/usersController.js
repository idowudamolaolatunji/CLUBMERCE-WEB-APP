const multer = require('multer');

const app = require('../app');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../model/usersModel');

////////////////////////////////////////////////
////////////////////////////////////////////////

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/asset/img/user/${req.file.filename}`);

  next();
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
                users,
                count: await User.find().countDocuments()
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
        res.status(200).json({
            status: "success",
            
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

        res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err) {
        res.status(400).json({
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
    // update user documents
    // 1. filter
    const allowedFileds = [fullName, email, country, phone, state, cityRegion, zipPostal];
    const filterBody = filterObj(req.body, allowedFileds);
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

// delete current user
exports.deleteAccount = catchAsync(async (req, res, next) => {
        // get user
    await User.findByIdAndUpdate(req.user.id, {active: false});

    res.status(204).json({
        status: "success",
        data: null
    })
});