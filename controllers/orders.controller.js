
module.exports.getOrdersForCurrentUser = async (req, res) => {
    const orders = await ordersCollection.find({email: req.params.email}).toArray();
    console.log(orders)
    res.send(orders);
}

module.exports.getAllOrders = async(req, res) => {
    const status = req.query.status;
    console.log(status)
    let orders;
   if(status !== 'All') {
     console.log('first')
    orders = await ordersCollection.find({orderStatus: req.query.status}).toArray();
    res.json(orders);
    return;
   }
   orders = await ordersCollection.find({}).toArray();
   res.json(orders);
}

module.exports.getOrderWithId = async(req, res) => {
    const result = await ordersCollection.findOne({_id: ObjectId(req.params.id)});
    res.json(result);
}

module.exports.addAnOrder = async(req, res) => {
    const result = await ordersCollection.insertOne(req.body);
    res.json(result);
}

module.exports.updateAnOrderWithId = async(req, res) => {
    const {_id, orderStatus} = req.body;
    console.log(_id, req);
    console.log('here')
    const result = await ordersCollection.updateOne({_id: ObjectId(_id)} , {$set: {orderStatus}})
    res.json(result);
}

module.exports.deleteAnOrderWithId = async(req, res) => {
    const result = await ordersCollection.deleteOne({ _id: ObjectId(req.params.id) });
    res.json(result);
}

