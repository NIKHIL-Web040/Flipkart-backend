const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Cart = mongoose.model(
  "Cart",
  new mongoose.Schema({
    userId: String,
    items: [
      {
        productId: String,
        quantity: Number,
      },
    ],
  })
);

router.post("/cart/add", async (req, res) => {
  try {
    const { productId, quantity = 1, user } = req.body;
    if (!productId || !user) {
      return res
        .status(400)
        .json({ message: "Product id and user is required!" });
    }
    let cart = await Cart.findOne({ userId: user, status: "active" });
    if (!cart) {
      cart = new Cart({ userId: user, items: [], status: "active" });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      cart.items.push({
        productId,
        quantity: parseInt(quantity),
      });
    }

    cart.updateAt = new Date();
    await cart.save();
  } catch (err) {
    res
      .status(500)
      .json({ error: "Intewrnal server Error,item has nnot been added" });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find({});

    if (carts.length > 0) {
      res.status(200).json({
        success: true,
        count: carts.length,
        data: carts,
      });
    }
  } catch (error) {
    console.log("Error fetching cart", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch data",
      error: error.message,
    });
  }
});

//delete route
// router.delete("/cart/item", async (req, res) => {
//   try {
//     const { userId, productId } = req.body;

//     if (!userId || !productId) {
//       return res
//         .status(400)
//         .json({ message: "Both userId and productId are required!" });
//     }

//     // Find the cart of the user
//     const cart = await Cart.findOne({ userId });

//     if (!cart) {
//       return res.status(404).json({ message: "Cart not found" });
//     }

//     // Filter out the product to be removed
//     const updatedItems = cart.items.filter(
//       (item) => item.productId !== productId
//     );

//     if (updatedItems.length === cart.items.length) {
//       return res.status(404).json({ message: "Item not found in the cart" });
//     }

//     cart.items = updatedItems;
//     cart.updatedAt = new Date();
//     await cart.save();

//     res.status(200).json({ message: "Item removed from cart", cart });
//   } catch (error) {
//     console.error("Error removing item from cart", error);
//     res
//       .status(500)
//       .json({ message: "Failed to remove item", error: error.message });
//   }
// });

router.delete("/cart/item", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      res.status(400).json({ message: "userId and productId are nnot found" });
    }

    const cart = await Cart.findOne({ userId, status: "active" });
    if (!cart) {
      return res.status(404).json({ message: "no cart foubnd " });
    }

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    if (updatedItems.length === cart.items.length) {
      res.status(404).json({ message: "item does not exist in cart" });
    }

    cart.items = updatedItems;
    await cart.save();
    res.status(200).json({ message: "item removed form cart", cart });
  } catch (error) {
    console.log("Error removing items form the cart", error);
    res.status(500).json({
      message: "failed to remove error form the cart",
      error: error.message,
    });
  }
});

module.exports = router;
