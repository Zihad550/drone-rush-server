const express = require("express");
const app = express();
const cors = require("cors");
const admin = require("firebase-admin");
const port = process.env.PORT || 5000;
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

// middle ware
app.use(cors());
app.use(express.json());

// firebase
const serviceAccount = require("./drone-rush-firebase-adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// mongo db use and password and client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bhmov.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }

  next();
}

async function run() {
  try {
    client.connect();
    const database = client.db("drone_rush");
    const dronesCollection = database.collection("drones");
    const homeDronesCollection = database.collection("home_drones");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");
    const reviewsCollection = database.collection("reviews");

    // get home drones
    app.get("/drones/homeDrones", async (req, res) => {
      const cursor = homeDronesCollection.find({});
      const drones = await cursor.toArray();
      res.send(drones);
    });

    // get all drones
    app.get("/drones", async (req, res) => {
      const cursor = dronesCollection.find({});
      const drones = await cursor.toArray();
      res.send(drones);
    });

    // get a drones
    app.get("/drones/:name", async (req, res) => {
      const name = req.params.name;
      const query = { name: name };
      const result = await dronesCollection.findOne(query);
      res.json(result);
    });

    // post drone
    app.post("/drones", async (req, res) => {
      const drone = req.body;
      const result = await dronesCollection.insertOne(drone);
      res.json(result);
    });

    // delete drone
    app.delete("/drones", async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) };
      const result = await dronesCollection.deleteOne(query);
      res.json(result);
    });

    // post order
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // get all orders
    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // get orders for current user
    app.get("/orders", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.send(orders);
    });

    // get a order
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.findOne(query);
      res.json(result);
    });

    // update orders
    app.put("/orders/:id", async (req, res) => {
      const order = req.body;
      const id = req.params?.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = { $set: order };
      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // post reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });

    // get reviews
    app.get("/reviews", async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // delete order
    app.delete("/orders", async (req, res) => {
      const id = req.query.id;
      console.log(id);
      const email = req.query.email;
      const query = { _id: ObjectId(id), email: email };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });

    // get users
    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    // post users
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    // update users
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

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
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(` listening at port:${port}`);
});
