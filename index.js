const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(cors());

const { router: authRoutes, authenticateJWT } = require("./auth");
const cartRoutes = require("./cart");
app.use(authRoutes);
app.use(cartRoutes);

mongoose
  .connect(
    "mongodb+srv://nikhilkohli1527:WzidZ2efbgZoMEWb@habit-tracker-cluster.i4h6mbm.mongodb.net/Project2"
  )
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
app.get("/products", async (req, res) => {
  try {
    const products = await products.find();
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
app.get("/product/:id", async (req, res) => {
  try {
    const products = await products.findById(req.params.id);
    if (!products) {
      return res
        .status(404)
        .json({ message: "The item you were searching for doesn't exist" });
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
app.listen(8080, () => {
  console.log("server is running on port 8080");
});
