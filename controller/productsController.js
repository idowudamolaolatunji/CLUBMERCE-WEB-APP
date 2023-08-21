const multer = require('multer');
const sharp = require('sharp');

const app = require('../app');
const catchAsync = require('../utils/catchAsync')
const Product = require('../model/productsModel');
const User = require('../model/usersModel');
const APIFeatures = require('../utils/apiFeatures');

////////////////////////////////////////////////
////////////////////////////////////////////////

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


exports.uploadProductImage = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imagesubs', maxCount: 6  },
  { name: 'imagebanners', maxCount: 4 }
]);

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if(!req.files.image || req.files.subImages) return next();

  const imageMainFileName = `product-${req.params.id}-${Date.now()}-main.jpeg`;

  await sharp(req.files.image[0].buffer)
      .resize(750, 750)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${imageMainFileName}`);

  req.body.image = imageMainFileName;

  
  // subImages
  req.body.subImages = [];
  await Promise.all(
    req.files.subImages.map(async (file, i) => {
    const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(750, 750)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${filename}`);

    req.body.subImages.push(filename);
   })
  );

  
  // banners
  req.body.banners = [];
  await Promise.all(
    req.files.banners.map(async (file, i) => {
    const filename = `product-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 950)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${filename}`);

    req.body.banners.push(filename);
   })
  );
  
  next();
})



exports.aliasTopProduct = (req, res, next) => {
    req.query.limit = '20';
    req.query.sort = '-createdAt,commission';
    // req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

exports.searchProduct = async (req, res) => {
    try {
      let payload = req.body.payload.trim();
      let search = await Product.find({ name: {$regex: new RegExp('^'+payload+'.*','i')}}).sort({ productGravity: -1, purchasesCount: -1 }).exec();

      // limit search result to 10
      search = search.slice(0, 10);
      res.status(200).json({
          payload: search
      })

    } catch(err) {
      res.status(404).json({
        status: 'fail',
        message: err.message
      })
    }
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



exports.createProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    /*
    // Validate and upload the main image to Cloudinary
    if (!req.files || !req.files['image'] || req.files['image'].length !== 1) {
      return res.status(400).json({ error: 'Invalid main image file' });
    }
    const mainImageResult = await cloudinary.uploader.upload(req.files['image'][0].path);

    // Validate and upload sub-images to Cloudinary
    const subImages = [];
    if (req.files && req.files['subImages'] && Array.isArray(req.files['subImages'])) {
      for (const subImage of req.files['subImages']) {
        const result = await cloudinary.uploader.upload(subImage.path);
        subImages.push(result.secure_url);
      }
    } else {
      return res.status(400).json({ error: 'Invalid sub-images files' });
    }

    // Validate and upload banners to Cloudinary
    const banners = [];
    if (req.files && req.files['banners'] && Array.isArray(req.files['banners'])) {
      for (const banner of req.files['banners']) {
        const result = await cloudinary.uploader.upload(banner.path);
        banners.push(result.secure_url);
      }
    } else {
      return res.status(400).json({ error: 'Invalid banner files' });
    }
    const newProduct = await Product.create({
      ...req.body,
      vendor: vendor._id,
      image: mainImageResult.secure_url,
      subImages: subImages,
      banners: banners,
    });
    */

    // let image;
    // if(req.file) image = req.file.filename;
    console.log(req, req.body);

    // const newProduct = await Product.create({
    //   ...req.body,
    //   vendor: vendor._id,
    //   image,
    //   subImages,
    //   banners,
    // });

    // res.status(201).json({
    //   status: 'success',
      // data: {
      //   product: newProduct,
      // },
    // });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: err.message ||'An error occurred while processing the request',
    // });
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


// Define a route to get products by category
exports.getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    console.log(category)

    // Fetch products from the database based on the selected category
    let products
    if(category === 'all') {
      products = await Product.find().sort({ createdAt: -1, productGravity: -1, purchasesCount: -1 })
    } else {
      products = await Product.find({ category: category }).sort({ createdAt: -1, productGravity: -1, purchasesCount: -1 });
    }
    
    if(!products) res.status(404).json({message: 'No product in this category'})

    res.status(200).json({
      status: 'success',
      data: {
        products,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Controller to get products based on the selected option
exports.getProductsByOption = async (req, res) => {
    try {
      const option = req.params;
      console.log(option)
  
      // Logic to get products based on the selected option
      let products;
      if (option === 'all') {
        products = await Product.find().sort({ createdAt: -1 });
      } else if (option === 'most-promoted') {
        products = await Product.find().sort({ clicks: -1 }).limit(20);
      } else if (option === 'gravity-high-low') {
        products = await Product.find().sort({ productGravity: -1 }).limit(20);
      } else if (option === 'gravity-low-high') {
        products = await Product.find().sort({ productGravity: 1 }).limit(20);
      } else if (option === 'physical-product') {
        products = await Product.find({ type: 'Physical' }).limit(20);
      } else if (option === 'recurring-commission') {
        products = await Product.find({ recurringCommission: true }).limit(20);
      } else if (option === 'commission-high-low') {
        products = await Product.find().sort({ commissionPercentage: { $gt: 20 } }).limit(20);
      } else if (option === 'commission-low-high') {
        products = await Product.find().sort({ commissionPercentage: { $lt: 20 } }).limit(20);
      } else if (option === 'digital-product') {
        products = await Product.find({ type: 'Digital' }).limit(20);
      } else if (option === 'least-promoted') {
        products = await Product.find().sort({ clicks: 1 }).limit(20);
      } else {
        products = await Product.find().limit(20);
      }
  
        //   res.render('products', { products }); // Replace 'products' with your actual view name
        res.status(200).json({
            status: 'success',
            data: {
            products,
            },
        });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      })
    }
};
  



exports.updateProduct = async(req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidation: true,
        });

        // Update the image field if a new image is uploaded
        if (req.body.image || req.body.subImages || req.body.banners) {
          updatedProduct.image = req.body.image;
          updatedProduct.subImages = req.body.subImages;
          updatedProduct.banners = req.body.banners;
          await updated.save();
        }

        res.status(200).json({
            status: "success",
            data: {
                product: updatedProduct
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
        await Product.findByIdAndRemove(req.params.id);

        res.status(200).json({
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
