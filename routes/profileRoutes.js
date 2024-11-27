const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/auth");

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user profile");
  }
});

const Film = require("../models/Film");
const Image = require("../models/Image");
const Meme = require("../models/Meme");
const Quiz = require("../models/Quiz");

router.get("/content", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const films = await Film.find({ userId });
    const images = await Image.find({ userId });
    const memes = await Meme.find({ userId });
    const quizzes = await Quiz.find({ userId });

    res.status(200).json({ films, images, memes, quizzes });
  } catch (error) {
    console.error("Error fetching user content:", error);
    res.status(500).json({ message: "Failed to retrieve content" });
  }
});

module.exports = router;