// const multer = require('multer');
// const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;

const app = require('../app');
const catchAsync = require('../utils/catchAsync')
const Product = require('../model/productsModel');
const User = require('../model/usersModel');
const APIFeatures = require('../utils/apiFeatures');

// const generateLink = require('./../utils/generateLink')
////////////////////////////////////////////////
////////////////////////////////////////////////

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINAR_API_KEY,
    api_secret: process.env.CLOUDINAR_API_SECRET,
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

const upload = require('../utils/uploadConfig');
// exports.createProduct = upload.fields(
//   [
//     { name: 'image', maxCount: 1 }, // Single main image
//     { name: 'subImages', maxCount: 6 }, // Array of sub-images, up to 6
//     { name: 'banners', maxCount: 4 }, // Array of banners, up to 4
//   ]), async (req, res) => {
//   try {
//     const vendorId = req.user._id;
//     // Find the vendor document from the database based on the vendor ID
//     const vendor = await User.findById(vendorId);
//     if (!vendor) {
//       return res.status(404).json({ error: 'Vendor not found' });
//     }

//     // Validate and upload the main image to Cloudinary
//     if (!req.files || !req.files['image'] || req.files['image'].length !== 1) {
//       return res.status(400).json({ error: 'Invalid main image file' });
//     }
//     const mainImageResult = req.files['image'][0];

//     // Validate and upload sub-images to Cloudinary
//     const subImages = [];
//     if (req.files && req.files['subImages'] && Array.isArray(req.files['subImages'])) {
//       for (const subImage of req.files['subImages']) {
//         subImages.push(subImage.path);
//       }
//     } else {
//       return res.status(400).json({ error: 'Invalid sub-images files' });
//     }

//     // Validate and upload banners to Cloudinary
//     const banners = [];
//     if (req.files && req.files['banners'] && Array.isArray(req.files['banners'])) {
//       for (const banner of req.files['banners']) {
//         banners.push(banner.path);
//       }
//     } else {
//       return res.status(400).json({ error: 'Invalid banner files' });
//     }

exports.createProduct = async (req, res) => {
  try {
    const vendorId = req.user._id;
    // Find the vendor document from the database based on the vendor ID
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

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

    res.status(201).json({
      status: 'success',
      data: {
        product: newProduct,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message ||'An error occurred while processing the request',
    });
  }
};

// exports.createProduct = async(req, res) => {
//     try {
//         const vendorId = req.user._id;
//         // Find the vendor document from the database based on the vendor ID
//         const vendor = await User.findById(vendorId);
//         if (!vendor) {
//             return res.status(404).json({ error: 'Vendor not found' });
//         }
        
//         // Validate and upload the image to Cloudinary
//         if (!req.file || req.file.size > 10 * 1024 * 1024) {
//           // Limit image size to 10MB
//           return res.status(400).json({ error: 'Invalid image file or size exceeds 10MB' });
//         }
//         const mainImageResult = await cloudinary.uploader.upload(req.file.path, {
//           folder: 'product_main_images',
//         });
    
//         // Validate and upload sub-images to Cloudinary
//         const subImages = [];
//         if (req.files && req.files.subImages && Array.isArray(req.files.subImages)) {
//           if (req.files.subImages.length > 6) {
//             return res.status(400).json({ error: 'Exceeded maximum of 6 sub-images' });
//           }
    
//           for (const subImage of req.files.subImages) {
//             if (subImage.size > 10 * 1024 * 1024) {
//               // Limit sub-image size to 10MB
//               return res.status(400).json({ error: 'Sub-image size exceeds 10MB' });
//             }
    
//             const result = await cloudinary.uploader.upload(subImage.path, {
//               folder: 'product_sub_images',
//             });
    
//             subImages.push(result.secure_url);
//           }
//         } else {
//           return res.status(400).json({ error: 'Invalid sub-image files' });
//         }
    
//         // Validate and upload banners to Cloudinary
//         const banners = [];
//         if (req.files && req.files.banners && Array.isArray(req.files.banners)) {
//           if (req.files.banners.length > 4) {
//             return res.status(400).json({ error: 'Exceeded maximum of 4 banners' });
//           }
    
//           for (const banner of req.files.banners) {
//             if (banner.size > 10 * 1024 * 1024) {
//               // Limit banner size to 10MB
//               return res.status(400).json({ error: 'Banner size exceeds 10MB' });
//             }
    
//             const result = await cloudinary.uploader.upload(banner.path, {
//               folder: 'product_banners',
//             });
    
//             banners.push(result.secure_url);
//           }
//         } else {
//           return res.status(400).json({ error: 'Invalid banner files' });
//         }


//         const newProduct = await Product.create({
//           ...req.body,
//           vendor: vendor._id,
//           image: mainImageResult.secure_url,
//           subImages: subImages,
//           banners: banners,
//         });

//         res.status(201).json({
//             status: "success",
//             data: {
//                 product: newProduct
//             }
//         })
//     } catch(err) {
//         res.status(404).json({
//             status: 'fail',
//             message: err.message
//         })
//     }
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
      products = await Product.find();
    } else {
      products = await Product.find({ category: category });
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
