
module.exports.addReview = async(req, res) => {
    const result = await productsCollection.updateOne({_id: ObjectId(req.params.id)}, {$push: {reviews: {...req.body}}});
      res.json(result);
}