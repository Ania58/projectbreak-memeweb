const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');
const axios = require('axios');


/*const getMemes = async (req, res) => {
    try {
      const response = await axios.get('https://api.imgflip.com/get_memes');
      //console.log(response)
  
      if (response.data.success) {
        res.json(response.data.data.memes); 
      } else {
        res.status(500).json({ message: 'Failed to fetch memes from the API' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error while fetching memes' });
    }
  };

  const getPaginatedMemes = async (req, res) => {
    const { pageNumber } = req.params;
    const memesPerPage = 8; 
    const start = (pageNumber - 1) * memesPerPage;
  
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      const memes = response.data.data.memes.slice(start, start + memesPerPage);
  
      res.json(memes);
    } catch (error) {
      console.error("Error fetching paginated memes:", error);
      res.status(500).json({ message: "Failed to load paginated memes" });
    }
  };
  
  module.exports = { getMemes, getPaginatedMemes };*/


  const getAllContent = async (req, res) => {
    try {
        const films = await Film.find(); 
        const images = await Image.find(); 

        res.status(200).json({ films, images }); // Send combined response
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: 'Failed to retrieve content' });
    }
};

module.exports = { getAllContent };