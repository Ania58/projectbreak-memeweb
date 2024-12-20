const Meme = require('../models/Meme');
const axios = require('axios');
const qs = require('qs');


const addAdminMeme = async (req, res) => {
  const { title, category, tags, rulesAccepted, copyrightsAccepted, isApproved } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 

  try {
    const newMeme = await Meme.create({
      title,
      category,
      imageUrl,
      tags: tags.split(',').map(tag => tag.trim()), 
      agreements: {
        rulesAccepted,
        copyrightsAccepted
      },
      isUserGenerated: false,
      isApproved: isApproved !== undefined ? isApproved : false,
      userId: req.user.uid,
    });

    res.status(201).json({ message: 'Admin meme created successfully', newMeme });
  } catch (error) {
    console.error("Error creating admin meme:", error);
    res.status(500).json({ message: 'Failed to create admin meme' });
  }
};


const addUserGeneratedMeme = async (req, res) => {
  const { title, category, templateId, topText, bottomText, tags, rulesAccepted, copyrightsAccepted } = req.body;

  try {
    if (!req.user || !req.user.uid) {
      return res.status(403).json({ message: "Unauthorized: User ID missing" });
    }

    const apiPayload = {
      template_id: templateId.id || templateId,
      text0: topText,
      text1: bottomText,
      username: process.env.IMGFLIP_USERNAME,
      password: process.env.IMGFLIP_PASSWORD,
    };

    const response = await axios.post(
      'https://api.imgflip.com/caption_image',
      qs.stringify(apiPayload), 
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const imageUrl = response.data?.data?.url; 

    if (!imageUrl) {
      throw new Error("Imgflip API did not return a valid URL");
    }

    const newMeme = await Meme.create({
      title,
      category,
      templateId: templateId.id || templateId,
      topText,
      bottomText,
      imageUrl,
      tags: Array.isArray(tags)
      ? tags.map((tag) => tag.trim())
      : tags.split(',').map((tag) => tag.trim()),
      agreements : {
        rulesAccepted: rulesAccepted === 'true' || rulesAccepted === true,
        copyrightsAccepted: copyrightsAccepted === 'true' || copyrightsAccepted === true
      },
      isUserGenerated: true,
      userId: req.user.uid,
    });

    res.status(201).json({ message: 'User-generated meme created successfully', newMeme });
  } catch (error) {
    console.error("Error creating user-generated meme:", error);
    res.status(500).json({ message: 'Failed to create user-generated meme' });
  }
};

const editMeme = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {

    const meme = await Meme.findById(id);
        if (!meme) return res.status(404).json({ message: 'Meme not found' });

        if (meme.userId !== req.user.uid) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own memes.' });
        }
        
        if (updates.templateId && typeof updates.templateId !== 'string') {
          return res.status(400).json({ message: 'Invalid template ID format' });
        }

    const updatedMeme = await Meme.findByIdAndUpdate(id, updates, { new: true });
    
    if (!updatedMeme) return res.status(404).json({ message: 'Meme not found' });
    res.status(200).json(updatedMeme);
  } catch (error) {
    console.error('Error editing meme:', error);
    res.status(500).json({ message: 'Failed to edit meme' });
  }
};


const deleteMeme = async (req, res) => {
  const { id } = req.params;

  try {

    const meme = await Meme.findById(id);
    if (!meme) return res.status(404).json({ message: 'Meme not found' });

    if (meme.userId !== req.user.uid) {
        return res.status(403).json({ message: 'Unauthorized: You can only delete your own memes.' });
    }

    await meme.deleteOne();

    res.status(200).json({ message: 'Meme deleted successfully' });
  } catch (error) {
    console.error('Error deleting meme:', error);
    res.status(500).json({ message: 'Failed to delete meme' });
  }
};

const getAllMemes = async (req, res) => {
    try {
        const memes = await Meme.find();
        res.status(200).json(memes);
    } catch (error) {
        console.error("Error fetching memes:", error);
        res.status(500).json({ message: "Failed to retrieve memes" });
    }
};

const getMemesByCategory = async (category) => {
  return await Meme.find({ category });
};

const getUserMemes = async (req, res) => {
  try {
    const userId = req.user.uid;
    const memes = await Meme.find({ userId });
    res.status(200).json(memes);
  } catch (error) {
    console.error("Error fetching user's memes:", error);
    res.status(500).json({ message: "Failed to retrieve user's memes" });
  }
};

const voteMeme = async (req, res) => {
  const { memeId } = req.params;
  const { vote } = req.body;

  try {
      const update = vote === 1 
            ? { $inc: { upvotes: 1 }, $set: { lastVotedAt: new Date() } }
            : { $inc: { downvotes: 1 }, $set: { lastVotedAt: new Date() } };

      const meme = await Meme.findByIdAndUpdate(memeId, update, { new: true });

      if (!meme) return res.status(404).json({ message: "Meme not found" });
      res.json({ upvotes: meme.upvotes, downvotes: meme.downvotes });
  } catch (error) {
      console.error("Error updating meme vote:", error);
      res.status(500).json({ message: "Failed to update vote" });
  }
};

module.exports = {
  addAdminMeme,
  addUserGeneratedMeme,
  editMeme,
  deleteMeme,
  getAllMemes,
  getMemesByCategory,
  getUserMemes,
  voteMeme
};