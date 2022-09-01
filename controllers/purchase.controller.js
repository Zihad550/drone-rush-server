
module.exports.getPurchasedProductsOfAnUser = async(req, res) => {
    const purchases = await ordersCollection.find({$and: [{email: req.query.email}, {status: 'Shipped'}]}).toArray();
    res.json(purchases);
}

