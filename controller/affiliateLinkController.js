const mongoose = require('mongoose');

const app = require("./../app");
const User = require("./../model/usersModel");
const Product = require("./../model/productsModel");
const generateLink = require('./../utils/generateLink')


exports.createAffiliateLink = async (req, res) => {
  try {
    const { username, trackingId } = req.body;
    let productSlug;
    if(req.params.productSlug) {
      productSlug = req.params.productSlug;
    // }else if() {
    }

    if(!username) return res.status(400).json({ message: 'Please provide your username' });

    const user = await User.findOne({ username });
    if(!user  || user.username !== req.user.username) return res.status(400).json({ message: 'Username is not valid or does not belong to you' });

    const userId = await user.slug;
    const productId = await Product.findOne({ slug: productSlug });
    if(!productId) return res.status(400).json({ message: 'No product with this ID' });

    const affiliateUrl = generateLink(userId, productId, trackingId);
    if(!(await User.affiliateUrl.includes(affiliateUrl))) {
      await User.affiliateUrl.push(affiliateUrl);
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      message: 'Your affiliate link created successfully...'
    });
    
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'something went wrong...'
    });
  }
}


exports.countClicksRedirects = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findOne({ slug: userId});
    const product = await Product.findOne({ slug: productId});

    if(!user || !product) return res.status(400).json({ message: 'User or product not found..' });
    const productSlug = await product.slug;
    // increment click counts for both user, product and also the unique url
    product.click++;
    user.click++;

    await Promise.all([product.save(), user.save()]);
    
    res.redirect(`${req.protocol}://${req.get('host')}/api/order/:${productSlug}`);
    // create a route that renders a product order page on /order/:productSlug, as the product order page
  } catch(err) {
    res.status(500).json({
      status: 'fail',
      message: 'internal server error...'
    });
  }
}