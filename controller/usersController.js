const app = require('../app');
const User = require('./../model/usersModel');

////////////////////////////////////////////////
////////////////////////////////////////////////
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
        await User.findByIdAndDelete(req.params.id);

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
}

exports.updateMe = async (req, res, next) => {
	try {
		// create an error if user POST's password data.
		if(req.body.password || req.body.passwordConfirm) {
			return next('This route is not for password updates. please use the password update route');
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
		
	} catch(err) {
		res.status(400).json({
			status: "fail",
			message: err.message
		})
	}
    next()
}

// delete current user
exports.deleteAccount = async (req, res, next) => {
	try {
        // get user
        await User.findByIdAndUpdate(req.user.id, {active: false});

        res.status(204).json({
            status: "success",
            data: null
        })
    } catch(err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
    next();
} 