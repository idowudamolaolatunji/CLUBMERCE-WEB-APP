// Example route to calculate performance metrics
router.get('/performance', async (req, res) => {
    try {
      // Fetch required data from User and Product models
      const users = await User.find().select('clicks');
      const products = await Product.find().select('purchaseCount');
  
      // Perform calculations
      const totalClicks = users.reduce((total, user) => total + user.clicks, 0);
      const totalPurchases = products.reduce((total, product) => total + product.purchaseCount, 0);
  
      res.json({ totalClicks, totalPurchases });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  

  router.get('/performance', async (req, res) => {
    try {
      // Retrieve all users except admins (based on your user roles)
      const users = await User.find({ role: { $ne: 'admin' } });
  
      let totalClicks = 0;
      let totalTransactions = 0;
      let totalPurchases = 0;
  
      for (const user of users) {
        totalClicks += user.clicks;
        totalTransactions += user.transactions;
  
        const soldProductsCount = user.soldProducts.length;
        totalPurchases += soldProductsCount;
      }
  
      // Other calculations and metrics based on your requirements
  
      res.json({
        success: true,
        totalClicks,
        totalTransactions,
        totalPurchases,
        // Other performance metrics
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

 
  