const mongoose = require("mongoose");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("./models/index");
const router = express.Router();

//signup router
router.post("/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash([password]);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
  res.status(200).json({ token });
});

//Login route
router.post("auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ userId: user._id }, "secret", { expiresIn: "1h" });
  } else {
    res.status(400).json({ error: "Invalid Credentials" });
  }
});

//jwt middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

module.exports = { router, authenticateJWT };
