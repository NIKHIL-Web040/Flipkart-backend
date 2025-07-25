const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  price: Number,
  discountPercentage: Number,
  rating: Number,
  stock: Number,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
});

const Product = mongoose.model("Product", productSchema, "Product");

const UserSchema = new mongoose.Schema({
  id: Number,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  address: [
    {
      type: String,
    },
  ],
});

const User = mongoose.model("User", UserSchema, "users");

const cartSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPercentage: { type: Number },
    rating: { type: Number },
    stock: { type: Number },
    brand: { type: String },
    category: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],
    productId: { type: Number },
    quantity: { type: Number, default: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    id: { type: Number },
  },
  { timestamps: true }
);

const Cart = new mongoose.model("Cart", cartSchema, "Carts");

module.exports = { Product, Cart, User };
