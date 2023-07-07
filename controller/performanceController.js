const app = require('../app');
const User = require('../model/usersModel');
const Product = require('../model/productsModel');


exports.affiliateAndProductPerformance = async (req, res) => {
    try {
        // Retrieve all users except admins and vendors (based on your user roles)
        // const users = await User.find({ role: { $ne: 'admin' } });
        const users = await User.find({ role: { $nin: ['admin', 'vendor'] } }).select('clicks').select('commission');

        // and products
        const products = await Product.find().select('purchasesCount').select('clicks');
        console.log(users, products);
  
        // Perform calculations
        const totalLinkClicks = users.reduce((total, user) => total + user.clicks, 0);
        const totalPurchases = products.reduce((total, product) => total + product.purchasesCount, 0);
        const totalProductClicks = products.reduce((total, product) => total + product.clicks, 0);
        // const 



    } catch(err) {}
}




// Admin gets every performance
exports.allPerformance = async (req, res) => {
    try {
        // Fetch the necessary data for calculations
        const users = await User.find();
        const products = await Product.find();
    
        // Calculate the metrics
        const totalUsers = users.length;
        const totalProducts = products.length;
        const totalClicks = users.reduce((total, user) => total + user.clicks, 0);
        const totalTransactions = users.reduce((total, user) => total + user.transactions, 0);
        const totalPurchases = products.reduce((total, product) => total + product.purchases, 0);
        const clickThroughRate = totalClicks / totalUsers;
        const conversionRate = totalTransactions / totalClicks;
    
        // Prepare the performance data
        const performance = {
            totalUsers,
            totalProducts,
            totalClicks,
            totalTransactions,
            totalPurchases,
            clickThroughRate,
            conversionRate,
        };
    
        res.status(200).json({
            status: 'success', 
            data: { 
                performance
            }
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  