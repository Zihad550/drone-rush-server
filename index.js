const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/verifyToken');
const {connectToServer} = require("./utils/dbConnect");
const productsRouter = require("./routes/v1/products.route");
const ordersRouter = require('./routes/v1/orders.route');
const purchaseRouter = require('./routes/v1/purchase.route');
const authRouter = require('./routes/v1/auth.route');
const usersRouter = require('./routes/v1/users.route');
const reviewRouter = require('./routes/v1/review.route');
const errorHandler = require('./middleware/errorHandler')

// application level middleware
const app = express(); 
dotenv.config()
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

// connect db
connectToServer((err) => {
  if(!err) {
app.listen(port, () => {
  console.log(` listening at port:${port}`);
});
  }else{
  console.log(err)
  }
  
})

// routes
// api = server routes
// products route
app.use("/api/v1/products", productsRouter);
// orders route
app.use("/api/v1/orders", ordersRouter);
// purchase route
app.use('/api/v1/purchase', purchaseRouter);
// authentication route
app.use('/api/v1/auth', authRouter);
// users route
app.use('/api/v1/users', usersRouter);
// review route
app.use('/api/v1/review', reviewRouter);

async function run() {
  try {
    client.connect();
    const database = client.db("drone_rush");
    const dronesCollection = database.collection("drones");
    const homeDronesCollection = database.collection("home_drones");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");
    const productsCollection = database.collection("products");

  } finally {
  }
}

run().catch(console.dir);


// default error handler 
const errorHandler = (err, req, res, next) => {
  if(res.headersSent){
    return next(err);
  }
  res.status(500).json({error: err})
}

app.use(errorHandler)

app.get("/", (req, res) => {
  res.send("Welcome to drone rush server");
});

/* ============
 * means it will hit all routes get,post,put...
===============*/
app.all('*', (req, res) => {
  res.send('No Route Found.')
})

app.use(errorHandler);



/* if any error occures from express */
process.on('unhandledRejection', (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  })
})