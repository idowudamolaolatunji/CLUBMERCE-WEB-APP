const multer = require('multer');
const sharp = require('sharp');

const app = require('../app');
const catchAsync = require('../utils/catchAsync')
const Product = require('../model/productsModel');
const User = require('../model/usersModel');
const APIFeatures = require('../utils/apiFeatures');

// const User = require("./../model/usersModel");
// const generateLink = require('./../utils/generateLink')
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

exports.uploadProductImages = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'brandLogo', maxCount: 1 },
    { name: 'subImages', maxCount: 6 },
    { name: 'banners', maxCount: 4 },
]);

// upload.single('image') req.file
// upload.array('images', 5) req.files

exports.resizeProductImages = catchAsync(async (req, res, next) => {
  if (!req.files.image || !req.files.subImages || !req.files.banners) return next();

  // 1) Main image
  req.body.image = `product-${req.params.id}-${Date.now()}-main.jpeg`;
  await sharp(req.files.image[0].buffer)
    .resize(700, 503)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/asset/img/product${req.body.image}`);

  // 2) Brand logo
  req.body.brandLogo = `product-${req.params.id}-${Date.now()}-brand-logo.jpeg`;
  await sharp(req.files.brandLogo[0].buffer)
    .resize(40, 25)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/asset/product/img/${req.body.brandLogo}`);

  // 2) Images
  req.body.subImages = [];

  await Promise.all(
    req.files.subImages.map(async (file, i) => {
      const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/asset/img/product${filename}`);

      req.body.subImages.push(filename);
    })
  );
  // 4) banners
  req.body.banner = [];

  await Promise.all(
    req.files.banner.map(async (file, i) => {
      const filename = `banner-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/asset/img/banner${filename}`);

      req.body.banner.push(filename);
    })
  );

  next();
});


exports.aliasTopProduct = (req, res, next) => {
    req.query.limit = '20';
    req.query.sort = '-createdAt,commission';
    // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};


exports.searchProduct = async (req, res) => {
    try {
        let payload = req.body.payload.trim();
        let search = await Product.find({ name: {$regex: new RegExp('^'+payload+'.*','i')}}).exec();

        // limit search result to 10
        search = search.slice(0, 10);
        res.status(200).json({
            payload: search
        })

    } catch(err) {}
}

exports.getAllProduct = async(req, res) => {
    try {
        const features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
        const products = await features.query;

       

        res.status(200).json({
            status: "success",
            data: {
                count: products.length,
                products
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};

exports.createProduct = async(req, res) => {
    try {
        // const vendorId = req.user.slug.split('-').at(-1);
        const vendorId = req.user._id;

        // Find the vendor document from the database based on the vendor ID
        const vendor = await User.findById(vendorId);

        // If the vendor is not found, handle the error
        if (!vendor) {
            return res.status(404).json({ error: 'Vendor not found' });
        }

        const newProduct = await Product.create({...req.body, vendor: vendor._id});

        res.status(201).json({
            status: "success",
            data: {
                product: newProduct
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};

exports.getProductsByVendor = async (req, res) => {
    try {
        // Assuming you have authenticated the vendor and stored their ID in the req.user.id
        const vendorId = req.user._id; 
    
        // Retrieve all products for the current vendor
        const products = await Product.find({ vendor: vendorId });
    
        res.status(200).json({
            status: 'success',
            count: products.length,
            data: {
                products,
            },
        });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        res.status(200).json({
            status: "success",
            data: {
                product: product
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};


exports.updateProduct = async(req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidation: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                product: updated
            }
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};

exports.deleteProduct = async(req, res) => {
    try {
        await Product.findByIdAndDelete(req.param.id);

        res.status(500).json({
            status: "success",
            data: null
        })
    } catch(err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};
