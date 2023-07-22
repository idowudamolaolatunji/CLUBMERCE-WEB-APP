const app = require('../app');
const Product = require('../model/productsModel');


// Vendor Product Management Routes
// Get all products for the current vendor
exports.getAllProductsByVendor = async (req, res) => {
    try {
        const vendorId = req.user.id;
        console.log(vendorId)
  
        // Find all products where the vendor field matches the current vendor ID
        const vendorProduct = await Product.find({ vendor: vendorId });
        res.status(200).json({
            status: 'success',
            count: vendorProduct.length,
            data: {
                products: vendorProduct
            }
        })
    
    } catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Get all products for the current vendor
exports.getProductByVendor = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { productId } = req.params;

  
        // Find one products where the vendor field matches the current vendor ID
        const product = await Product.findOne({ _id: productId, vendor: vendorId });
        res.status(200).json({
            status: 'success',
            data: {
                product,
            }
        })
    
    } catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
  
// Create a new product for the current vendor '/vendor/products'
exports.createProductByVendor = async (req, res) => {
    try {
        const vendorId = req.user.id;
    
        // Create a new product and set the vendor field to the current vendor ID
        const newProduct = await Product.create( req.body, { vendor: vendorId });
    
            // Add the product ID to the vendor's product list
            // User.findByIdAndUpdate(vendorId, { $push: { products: savedProduct._id } })
            // res.status(500).json({ error: 'Internal server error' });
        res.status(201).json({
            status: "success",
            data: {
                product: newProduct
            }
        })
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
  
  // Update a product for the current vendor /vendor/products/:productId
exports.updateProductByVendor = async (req, res) => {
    try {
        const vendorId = req.user.id;
        const { productId } = req.params;
    
        // Find the product and check if the vendor field matches the current vendor ID
        const updatedProduct = await Product.findOneAndUpdate({ _id: productId, vendor: vendorId }, req.body, {
            new: true,
            runValidation: true,
        });
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }
        res.status(200).json({
            status: 'success',
            data: {
                product: updatedProduct,
            }
        });
    }
    catch(err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
  
  // Delete a product for the current vendor /vendor/products/:productId
exports.deleteProductByVendor = async(req, res) => {
    try {
        const vendorId = req.user.id;
        const { productId } = req.params;
    
        // Find the product and check if the vendor field matches the current vendor ID
        const deletedProduct = await Product.findOneAndDelete({ _id: productId, vendor: vendorId })
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }
    
            // Remove the product ID from the vendor's product list
            // User.findByIdAndUpdate(vendorId, { $pull: { products: productId } })
                // res.json({ success: true });
                // res.status(500).json({ error: 'Internal server error' });
        res.status(200).json({
            status: 'success',
            data: null
        })
    } catch(err) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
  