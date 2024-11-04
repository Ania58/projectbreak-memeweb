const Meme = require('../models/Meme');
const axios = require('axios');


const addAdminMeme = async (req, res) => {
  const { title, category, tags, rulesAccepted, copyrightsAccepted } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 

  //console.log(req.body); 
  //console.log({ rulesAccepted, copyrightsAccepted }); 

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
      isUserGenerated: false
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
    const response = await axios.post('https://api.imgflip.com/caption_image', {
      template_id: templateId,
      text0: topText,
      text1: bottomText,
    });

    const imageUrl = response.data.data.url;

    const newMeme = await Meme.create({
      title,
      category,
      templateId,
      topText,
      bottomText,
      imageUrl,
      tags: tags.split(',').map(tag => tag.trim()), 
      agreements: {
        rulesAccepted,
        copyrightsAccepted
      },
      isUserGenerated: true
    });

    res.status(201).json({ message: 'User-generated meme created successfully', newMeme });
  } catch (error) {
    console.error("Error creating user-generated meme:", error);
    res.status(500).json({ message: 'Failed to create user-generated meme' });
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

module.exports = {
  addAdminMeme,
  addUserGeneratedMeme,
  getAllMemes,
  getMemesByCategory
};