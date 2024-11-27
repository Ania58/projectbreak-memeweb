const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/auth");

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.uid });
    if (!user) return res.status(404).send("User not found");
    res.json(user.posts);
  } catch (error) {
    res.status(500).send("Error retrieving posts");
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const user = await User.findOne({ uid: req.uid });
    if (!user) return res.status(404).send("User not found");

    const newPost = { content, timestamp: new Date() };
    user.posts.push(newPost);
    await user.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).send("Error creating post");
  }
});

module.exports = router;
