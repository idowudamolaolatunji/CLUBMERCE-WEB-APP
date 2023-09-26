const multer = require('multer');
const sharp = require('sharp');

const app = require('../app');
const catchAsync = require('../utils/catchAsync')
const Product = require('../model/productsModel');
const User = require('../model/usersModel');
const APIFeatures = require('../utils/apiFeatures');

////////////////////////////////////////////////
////////////////////////////////////////////////
// const cloudinary = require('cloudinary').v2
// cloudinary.config({ 
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//   api_key: process.env.CLOUDINARY_API_KEY, 
//   api_secret: process.env.CLOUDINARY_SECRET_KEY 
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


exports.uploadProductImage = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'imagesubs', maxCount: 6  },
  { name: 'imagebanners', maxCount: 4 }
]);

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if(!req.files.image || req.files.imagesubs) return next();
  const productId = req.params.id;
  console.log(productId)

  const imageMainFileName = `product-${productId}-${Date.now()}-main.jpeg`;

  await sharp(req.files.image[0].buffer)
      .resize(750, 750)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${imageMainFileName}`);

  req.files.image.filename = imageMainFileName;

  
  // imagesubs
  req.files.imagesubs.filenames = [];
  await Promise.all(
    req.files.imagesubs.map(async (file, i) => {
    const filename = `product-${productId}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(750, 750)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${filename}`);

    req.files.imagesubs.filenames.push(filename);
   })
  );

  
  // banners
  req.files.imagebanners.filenames = [];
  await Promise.all(
    req.files.imagebanners.map(async (file, i) => {
    const filename = `product-${productId}-${Date.now()}-${i + 1}.jpeg`;
    await sharp(file.buffer)
      .resize(2000, 950)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/asset/img/products/${filename}`);

    req.files.imagebanners.filenames.push(filename);
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

    // Create a new product document using Mongoose
    const newProduct = await Product.create({
      ...req.body,
      vendor: vendorId,
    });

    // Validate and save the product
    // await newProduct.validate(); // This will trigger validation

    // Respond with a success message
    res.status(201).json({
      status: 'success',
      message: 'Product created successfully',
      data: {
        product: newProduct
      }
    });
  } catch (error) {

    res.status(400).json({
      status: 'fail',
      message: error.message || 'Product creation failed'
    });
  }
};

exports.createProductImages = async(req, res) =>{
  try{
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
  
    const fileName = `product-${productId}-${Date.now()}-main.png`;
    await sharp(req.files['image'][0].buffer)
      .resize(750, 750)
      .toFormat('png')
      .png({ quality: 90 })
      .toFile(`public/asset/img/products/${fileName}`);
      const mainImage = fileName;

    // Process subImages
    const subImages = [];
    if (req.files['imagesubs'] && Array.isArray(req.files['imagesubs'])) {
      for (const subImage of req.files['imagesubs']) {
        const fileName = `product-${productId}-${Date.now()}-${subImages.length + 1}.jpeg`
        await sharp(subImage.buffer)
          .resize(750, 750)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/asset/img/banners/${fileName}`);
        subImages.push(fileName);
      }
    }

    // Process banners
    const banners = [];
    if (req.files['imagebanners'] && Array.isArray(req.files['imagebanners'])) {
      for (const banner of req.files['imagebanners']) {
        const fileName = `product-${productId}-${Date.now()}-${banners.length + 1}.jpeg`
        await sharp(banner.buffer)
          .resize(2000, 950)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/asset/img/products/${fileName}`);
        banners.push(fileName);
      }
    }
 
    console.log(req.files, banners, subImages, mainImage);
    console.log('i am the response');

    product.image = mainImage;
    product.subImages = subImages;
    product.banners = banners;
    await product.save();

    res.status(200).json({
      status: 'success',
      message: 'Product upload successful'
    })
  }catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'Images update failed..'
    })
  }
}


// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image')) {
//       console.log(file)
//         cb(null, true);
//     } else {
//         cb(new Error('Not an image! Please upload only images'), false);
//     }
// }
// const upload = multer({
//     storage: multerStorage,
//     fileFilter: multerFilter
// });

// exports.uploadProductImages = upload.fields([
//   { name: 'image', maxCount: 1 },
//   { name: 'imagesubs', maxCount: 6  },
//   { name: 'imagebanners', maxCount: 4 }
// ]);

// exports.createProduct = async (req, res) => {
//   try {
//     // Handle the uploaded image using Sharp
//     console.log(req.files)
//     const mainImage = await sharp(req.files.image[0].buffer)
//     .resize(750, 750)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toBuffer();

//     // Handle the uploaded subImages using Sharp
//     const subImages = await Promise.all(req.files.imagesubs.map(async (file, i) => {
//         return sharp(file.buffer)
//             .resize(750, 750)
//             .toFormat('jpeg')
//             .jpeg({ quality: 90 })
//             .toBuffer();
//     }));

//     // Handle the uploaded bannerImages using Sharp
//     const bannerImages = await Promise.all(req.files.imagebanners.map(async (file, i) => {
//         return sharp(file.buffer)
//             .resize(2000, 950)
//             .toFormat('jpeg')
//             .jpeg({ quality: 90 })
//             .toBuffer();
//     }));

//     // Create a new product document using Mongoose
//     const product = new Product({
//       ...req.body,
//       vendor: vendorId,
//       image: mainImage,
//       subImages: subImages,
//       banners: bannerImages,
//     });

//     // Save the product document to MongoDB
//     await product.save();

//     // Respond with a success message
//     res.status(201).json({ status: 'success', message: 'Product created successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ status: 'fail', message: 'Product creation failed' });
//   }
// };



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
        products = await Product.find().sort({ isBoosted: -1, createdAt: -1 });
      } else if (option === 'most-promoted') {
        products = await Product.find().sort({ clicks: -1 });
      } else if (option === 'gravity-high-low') {
        products = await Product.find().sort({ productGravity: -1 });
      } else if (option === 'gravity-low-high') {
        products = await Product.find().sort({ productGravity: 1 });
      } else if (option === 'physical-product') {
        products = await Product.find({ type: 'Physical' });
      } else if (option === 'recurring-commission') {
        products = await Product.find({ recurringCommission: true });
      } else if (option === 'commission-high-low') {
        products = await Product.find().sort({ commissionPercentage: { $gt: 20 } });
      } else if (option === 'commission-low-high') {
        products = await Product.find().sort({ commissionPercentage: { $lt: 20 } });
      } else if (option === 'digital-product') {
        products = await Product.find({ type: 'Digital' });
      } else if (option === 'least-promoted') {
        products = await Product.find().sort({ clicks: 1 });
      } else {
        products = await Product.find();
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
  


// update product
exports.updateProduct = async(req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidation: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                product: updatedProduct
            }
        })
    } catch(err) {
        console.log(err, err.message)
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
};

// update product images
exports.updateProductImages = async(req, res) => {
  try{

  }catch(err) {
    
  }
}


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
