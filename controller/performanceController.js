const app = require('../app');
const User = require('../model/usersModel');
const Product = require('../model/productsModel');


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
                performance,
            }
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
  