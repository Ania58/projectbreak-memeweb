const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middlewares/auth");

router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.uid });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user profile");
  }
});

router.post("/", verifyToken, async (req, res) => {
  const { uid, name, email } = req.body;
  try {
    let user = await User.findOne({ uid });
    if (!user) {
      user = new User({ uid, name, email });
      await user.save();
    } else {
      user.name = name;
      user.email = email;
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Error updating or creating profile");
  }
});

module.exports = router;