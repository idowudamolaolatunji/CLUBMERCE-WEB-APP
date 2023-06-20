const app = require('../app');
const Product = require('./../model/productsModel');


////////////////////////////////////////////////
////////////////////////////////////////////////
exports.getAllProduct = async(req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            status: "success",
            data: {
                products,
                count: products.length
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
        const newProduct = await Product.create(req.body);

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