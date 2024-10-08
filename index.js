const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middlewares/verifyToken");

// middle ware
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

// mongo db use and password and client
const uri = process.env.URI;
const client = new MongoClient(uri);

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

    // get home drones
    app.get("/products", async (req, res) => {
      const productsPerPage = Number(req.query.productsPerPage);
      let currentPage = Number(req.query.currentPage) - 1;
      let promise;

      if (currentPage) {
        promise = dronesCollection
          .find({})
          .skip(currentPage * productsPerPage)
          .limit(productsPerPage)
          .toArray();
      } else {
        promise = dronesCollection.find({}).limit(productsPerPage).toArray();
      }

      const [totalProducts, result] = await Promise.all([
        dronesCollection.countDocuments({}),
        promise,
      ]);

      res.send({ products: result, totalProducts });
    });

    // get a product
    app.get("/products/:id", async (req, res) => {
      const result = await productsCollection.findOne({ _id: req.params.id });
      res.json(result);
    });

    // post drone
    app.post("/product", verifyToken, async (req, res) => {
      const result = await productsCollection.insertOne(req.body);
      res.json(result);
    });

    // delete drone
    app.delete("/product/:id", verifyToken, async (req, res) => {
      const result = await productsCollection.deleteOne({
        $and: [{ _id: ObjectId(req.params.id) }, { deletable: true }],
      });
      res.json(result);
    });

    // get orders for current user
    app.get("/orders/:email", verifyToken, async (req, res) => {
      const orders = await ordersCollection
        .find({ email: req.params.email })
        .toArray();
      res.send(orders);
    });

    // get purchased products
    app.get("/purchases/:email", verifyToken, async (req, res) => {
      const purchases = await ordersCollection
        .find({ $and: [{ email: req.query.email }, { status: "Shipped" }] })
        .toArray();
      res.json(purchases);
    });

    // get all orders
    app.get("/orders", verifyToken, async (req, res) => {
      const status = req.query.status;
      let orders;
      if (status !== "All") {
        orders = await ordersCollection
          .find({ orderStatus: req.query.status })
          .toArray();
        res.json(orders);
        return;
      }
      orders = await ordersCollection.find({}).toArray();
      res.json(orders);
    });

    // get a order
    app.get("/orders/:id", verifyToken, async (req, res) => {
      const result = await ordersCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    // post order
    app.post("/order", verifyToken, async (req, res) => {
      const result = await ordersCollection.insertOne(req.body);
      res.json(result);
    });

    // update orders
    app.patch("/orders", verifyToken, async (req, res) => {
      const { _id, orderStatus } = req.body;
      const result = await ordersCollection.updateOne(
        { _id: ObjectId(_id) },
        { $set: { orderStatus } },
      );
      res.json(result);
    });

    // delete order
    app.delete("/order/:id", verifyToken, async (req, res) => {
      const result = await ordersCollection.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.json(result);
    });

    // auth
    // register
    app.post("/register", async (req, res) => {
      const { password, email, name } = req.body;
      try {
        const exists = await usersCollection.findOne({ email });
        if (exists) {
          res.json({ error: "Authentication failed" });
          return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { name, email, password: hashedPassword };
        const result = await usersCollection.insertOne({
          ...user,
          role: "user",
        });
        // generate token
        const token = jwt.sign(
          { userName: user.name, userId: result.insertedId },
          process.env.JWT_SECRET,
          {
            // expiresIn: '1h'
          },
        );
        res.status(200).json({
          name: user.name,
          email: user.email,
          accessToken: token,
          _id: result.insertedId,
          role: "user",
        });
      } catch {
        res.json({ error: "Authentication failed" });
      }
    });

    // login
    app.post("/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        const isValidPassword = bcrypt.compare(password, user.password);
        if (isValidPassword) {
          // generate token
          const token = jwt.sign(
            { userName: user.name, userId: user._id },
            process.env.JWT_SECRET,
            {
              // expiresIn: '1h'
            },
          );
          res.status(200).json({
            name: user.name,
            email: user.email,
            accessToken: token,
            role: user.role,
            _id: user._id,
          });
        } else {
          res.status(401).json({
            error: "Authentication failed",
          });
        }
      } catch {
        res.status(401).json({
          error: "Authentication failed",
        });
      }
    });

    // get users
    app.get("/users", verifyToken, async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.send(users);
    });

    // check if the used is admin
    app.get("/users/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // update user as admin
    app.put("/users/admin", verifyToken, async (req, res) => {
      const user = req.body;
      const requester = req.decodedEmail;
      if (requester) {
        const requesterAccount = await usersCollection.findOne({
          email: requester,
        });
        if (requesterAccount?.role === "admin") {
          const filter = { email: user.email };
          const updateDoc = { $set: { role: "admin" } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
        }
      } else {
        res
          .status(403)
          .json({ message: "you do not have access to make admin" });
      }
    });

    // add review
    app.patch("/review/:id", verifyToken, async (req, res) => {
      const result = await productsCollection.updateOne(
        { _id: ObjectId(req.params.id) },
        { $push: { reviews: { ...req.body } } },
      );
      res.json(result);
    });
  } finally {
    // default error handler
    const errorHandler = (err, req, res, next) => {
      if (res.headersSent) {
        return next(err);
      }
      res.status(500).json({ error: err });
    };

    app.use(errorHandler);

    app.get("/", (req, res) => {
      res.send("Welcome to drone rush server");
    });

    app.listen(port, () => {
      console.log(` listening at port:${port}`);
    });
  }
}

run().catch(console.dir);
