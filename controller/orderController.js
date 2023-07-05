const mongoose = require('mongoose');
const Product = require('../model/productsModel')
const Order = require('../model/orderModel')

mongoose.Promise = global.Promise

//create orders
exports.createOrders = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
    
        if(!product){
            return res.status(404).json({
                message: 'Product Not Found!'
            })
        }
        const newOrder = await Order.create({
            // _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId,
            emailAddress: req.body.emailAddress,
            fullname: req.body.fullname,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            postalCode: req.body.postalCode,
            address: req.body.address,
        });

        res.status(200).json({
            status: 'success',
            message: 'Order created successfully',
            data: {
                order: newOrder,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}


//get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1});
        // const orders = await Order.find().sort({ date: -1}).populate('product', 'name')
        
        if(orders.length < 1){
            return res.json({msg: 'No order has been made yet'})
        }
        res.status(200).json({
            status: 'success',
            count: orders.length,
            data: {
                order: orders,
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//get a single order
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        // const order = await Order.findById(req.params.id).populate('product', 'name description amount')
        if(!order){
            return res.status(404).json({
                message: 'Order Not Found!'
            })
        }
        res.status(200).json({
            status: 'success',
            data: {
                order
            }
        })
    } catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//edit order
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        
        if(!order){
            res.status(404).json({
                status: 'fail',
                message: `Order with the Id: ${id} cannot be found`
            })
        }

        const updatedOrder = await order.updateOne(order.id, req.body.quantity, {
            new: true,
            runValidation: true,
        })
        res.status(200).json({
            status: 'success',
            message: 'Order updated successfully',
            data: {
                order: updatedOrder
            }
        })
    }catch(err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}

//delete order
exports.deleteOrder = async(req, res) => {
    try {
        const order = await Order.findByIdAndRemove(req.params.id);
        res.status(200).json({
            status: 'success',
            message: 'Order deleted successfully',
            data: null
        })
    } catch(err) {
        res.status(500).json({
            status: 'fail',
            message: err
        })
    }
}