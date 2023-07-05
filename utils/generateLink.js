
const generateLink = function(userId, productId, trackingId) {
    const url = `${req.protocol}://${req.get('host')}/api/hoplink/:${userId}/:${productId}/${trackingId ? `:${trackingId}`: ''}`
    return url;
}

module.exports = generateLink;