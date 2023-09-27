const crypto = require('crypto')

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        // required: [true, "Enter your full name"],
        maxLength: [40, "Full name must not be more than 40 characters"],
        minLength: [8, "Full name must not be more than 8 characters"],
        lowercase: true
    },
    username: {
        type: String,
        unique: [true, "Username must be unique"],
        trim: true,
        required: [true, "Enter a username"]
    },
    email: {
        type: String,
        required: [true, "A user account must have an email"],
        trim: true,
        unique: [true, "Email must be unique"],
        lowercase: true,
        validate: [validator.isEmail, "Enter a valid email"] 
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Enter a password"],
        minLength: [8, "Password must not be less than 8 characters"],
        select: false,
    },
    // NEVER EVER STORE PLAN PASSWORD IN A DATABASE, ONLY ENCRYPTED
    passwordConfirm: {
        type: String,
        trim: true,
        required: [true, "Enter a password"],
        validate: {
            // validator only works on create or on save
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not the same"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    country: String,
    state: String,
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        enum: ['buyer', 'affiliate', 'vendor', 'admin'],
        default: 'affiliate',
        required: true,
    },
    zipCode: Number,
    businessName: {
        type: String,
        maxLength: [40, "Full name must not be more than 40 characters"],
        minLength: [8, "Full name must not be more than 8 characters"],
        lowercase: true
    },
    region: String,
    image: {
        type: String,
        default: 'avatar.png'
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    slug: String,
    bankName: String,
    bankAccountNumber: String,
    bankHolderName: String,
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    availableAmountWallet: {
        type: Number,
        default: 0.00,
    },
    pendingAmountWallet: {
        type: Number,
        default: 0.00,
    },
    totalAmountWallet: {
        type: Number,
        default: 0.00,
    },
    isAffiliate: {
        type: Boolean,
        default: false,
    },
    isBuyer: {
        type: Boolean,
        default: false,
    },
    // **** Vendor focused **** //
    isVendor: {
        type: Boolean,
        default: false,
    },
    vendorAccountType: {
        type: String,
        enum: ['free', 'standard', 'premium'],
        default: 'free'
    },
    vendorSubscriptionActive: {
        type: Boolean,
        default: false,
    },
    vendorSubscriptionType: {
        type: String,
        enum: [null, 'standard', 'premium'],
        default: null
    },
    vendorAccountTypeExpiresIn: {
        type: Date,
    },
    vendorAccountTypeProductLendth: Number,
    // ************** //
    clicks: {
        type: Number,
        default: 0,
    },
    isLogIn: {
        type: Boolean,
        default: false
    },
    promotionLinksCounts: { type: Number, default: 0 },
    affiliateLinks: [mongoose.Schema.Types.Mixed],
    productSold: {
        type: Number,
        default: 0
    },
    socketId: String,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

// PASSWORD SECURITY, USING THE EXPRESS PRE HOOK MIDDLEWARE
const saltRounds = 12;
userSchema.pre('save', async function(next) {
    // only run is password is not modified
    if(!this.isModified('password')) return next();

    // hash password with a cost of 12 salt rounds
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;

    // delete the confirmpassword field (undefined is best in objects)
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function(next) {
    const slug = slugify(this.username, { lower: true });
    this.slug = `${slug}-${this._id}`;
    next();
})

userSchema.pre('save', function(next) {
    if(!this.isModified('Password') || this.isNew) 
        return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
})
// userSchema.pre('save', function(next) {
//     this.totalAmountWallet = this.pendingAmountWallet += this.availableAmountWallet
//     next();
// })

userSchema.pre('save', function(next) {
    if(this.role !== 'vendor') {
        this.vendorAccountType = null;
        this.vendorAccountTypeExpiresIn = null;
    }else if(this.role === 'vendor' && this.vendorAccountType === 'standard' && this.vendorSubscriptionActive) {
        this.vendorAccountTypeProductLendth = 50;
    } else if(this.role === 'vendor' && this.vendorAccountType === 'premium' && this.vendorSubscriptionActive) {
        this.vendorAccountTypeProductLendth = 10000000000;
    } else {
        this.vendorAccountTypeProductLendth = 10;
    }
    next();
})

// hide all inactive user
userSchema.pre(/^find/, function(next) {
    // this.find( { active: true } );
    this.find({ active: { $ne: false }});
    next();
});
userSchema.methods.comparePassword = async function(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
}
userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
    if(this.passwordChangedAt) {
        const changeTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return jwtTimeStamp < changeTimeStamp;
    }
    // return false means not changed
    return false;
}
userSchema.methods.createPasswordResetToken = function() {
    // create random bytes token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // simple hash random bytes token
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetToken = hashedToken;

    // create time limit for token to expire (10 mins)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
    // send the unencrypted version
}


const User = mongoose.model('User', userSchema);
module.exports = User;