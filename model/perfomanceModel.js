// write out very comprehensively, an affiliate link generation functionality and also track the clicks that happens through the link generated and don't forget that an affiliate user an affiliate promotion link from more than one product, so create a field in the affiliate user schema that holds like an array of every affiliate link that gets generated for him through his user id in code and explanations.

// Act as a backend developer, using node.js, mongoose, express and MONGODB.

// Remember, you don't necessarily have to create a new Schema for the Affiliate link functionality, but you would need to access the current user id and that particular product id and evaluate the best way possible to solving this.

// keep in mind that vendors here do not sell products to an affiliate, the affiliate get a promotion link and promote such link to the internet and then a buyer or a visitor through that link can purchase such product, so do not create the transaction model specifying with out need for the product but specifying which user has that particular transaction and then for the order remember only the vendor and the site admin can get this order and the order and payment is made by the visitor

// the transaction schema making reference to the individual user or user wallet, finally the transaction controller and these  transactions are the updated wallet that you previously did in the order controller, now create for transferring to individual bank accounts for the affiliate and the vendor which can also be called creating a transaction as you prefer but this route function would use a post request and make a transfer from the company payment api to the req user bank account, also routes to get individual transaction, to get all transaction for admin

// how can we implement a final result called performance that takes clickes from user models or product models and take transaction for each users except admins, also takes purchases when a product is bought which means create a field on the user schema for soldProduct and also on the product schema and add to it each time a product is successfully ordered and paid for, and finally gives us a good info called performance

// Ask more questions as you proceed