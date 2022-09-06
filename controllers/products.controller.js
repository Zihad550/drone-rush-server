const { getDb } = require("../utils/dbConnect");

module.exports.getAllProducts = async (req, res, next) => {
 
      try{
        const db = getDb();

        const productsPerPage = Number(req.query.productsPerPage);
            let currentPage = Number(req.query.currentPage) - 1;
      const query = await db.collection('products').find({});
      const totalProducts = await query.count();
      let result;
      
      if(currentPage){
        result = query.skip(currentPage * productsPerPage).limit(productsPerPage);  
      }
      else{
        result = query.limit(productsPerPage);
      }
      result = await result.toArray();
      res.status(200).send({
        success: true,
        messages: 'Success',
        data: {
          products: result, totalProducts
        }
      });
      }
      catch(error){
        next(error)
      }
}

module.exports.getProductWithId = async(req, res) => {
    const result = await productsCollection.findOne({_id: req.params.id});
    res.json(result);
}

module.exports.addProduct = async(req, res) => {
        const result = await productsCollection.insertOne(req.body);
        res.json(result);
}

module.exports.deleteProduct = async(req, res) => {
    const result = await productsCollection.deleteOne({$and: [{_id: ObjectId(req.params.id)}, {deletable: true}] });
      console.log(result)
      res.json(result);
}