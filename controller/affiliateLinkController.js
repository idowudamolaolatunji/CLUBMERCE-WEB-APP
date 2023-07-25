const app = require('../app');
const User = require('../model/usersModel');
const Product = require('../model/productsModel');
const AffiliateLink = require('../model/affiliteLinkModel');

exports.createAffiliateLink = async (req, res) => {
  try {
    const { username, trackingId } = req.body;
    if(username.length < 1) return res.status(400).json({ message: 'Please provide your username..' });

    // Find the user and product
    const user = await User.findOne({ username });
    const product = await Product.findOne({ slug: req.params.productSlug });
    if(!user) return res.status(400).json({ message: 'Enter a valid user...' });

    // Generate the affiliate promotion link
    let promotionLink;
    if(!process.env.NODE_ENV === 'development') {
      promotionLink = `https://www.clubmerce.com/unique_/${user.slug}/${product.slug}`
    }
    promotionLink = `${req.protocol}://${req.get('host')}/unique_/${user.slug}/${product.slug}`
    // console.log(await AffiliateLink.find({ product: product._id }), 'length:', (await AffiliateLink.find({ product: product._id })).length)

    const gravity = await AffiliateLink.find({ product: product._id });
    console.log(gravity.length)
    product.productGravity = gravity.length
    await product.save({});

    // Check if link already exist and then create link and update links array
    if(!user.affiliateLinks.includes(promotionLink)) {
      // create link
        const newLinkDetails = await AffiliateLink.create({
            user: user._id,
            product: product._id,
            link: promotionLink,
            trackingId: trackingId || null
        });

        // add links to link arrays
        user.affiliateLinks.push(newLinkDetails.link);
        user.promotionLinksCounts = user.affiliateLinks.length;
        await user.save({ validateBeforeSave: false })
        res.json({ status: 'success', link: promotionLink });
    } else {
        return res.json({message: 'Url already exist', link: promotionLink})
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.countClicksRedirects = async (req, res) => {
  try {
    const { userSlug, productSlug } = req.params;

    const user = await User.findOne({ slug: userSlug});
    const product = await Product.findOne({ slug: productSlug});

    if(!user || !product) return res.status(400).json({ message: 'User or product not found..' });

    // Find the affiliate link and update the click count and also both user, product
    const updated = await AffiliateLink.findOneAndUpdate(
        { user: user.username, product: product.slug },
        { $inc: { clicks: 1 } },
        { new: true }
    )

    product.clicks++;
    user.clicks++;
    await Promise.all([product.save({ validateBeforeSave: false }), user.save({ validateBeforeSave: false })]);
    
    // res.redirect(`https://clubmerce.com/order-product/${user.username}/${productSlug}`);
    res.redirect(`http://127.0.0.1:3000/order-product/${user.username}/${productSlug}`);
    // create a route that renders a product order page on /order/username:productSlug, as the product order page

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.getAllLinks = async (req, res) => {
  try {
    const affLinks = await AffiliateLink.find();

    res.status(200).json({
      status: 'success',
      count: affLinks.length,
      data: {
        affLinks
      }
    })
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: 'error'
    })
  }
}
