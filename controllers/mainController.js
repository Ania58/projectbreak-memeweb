const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');
const axios = require('axios');

const { getFilmsByCategory } = require('./filmController');
const { getImagesByCategory } = require('./imageController');
const { getMemesByCategory } = require('./memeController');
const { getQuizzesByCategory } = require('./quizController');


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

  const getPaginatedContent = async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const itemsPerPage = 8;
    
    try {
      const films = await Film.find({ isApproved: true });
      const images = await Image.find({ isApproved: true });
      const memes = await Meme.find({ isApproved: true });
      const quizzes = await Quiz.find({ isApproved: true });
  
      const allContent = [...films, ...images, ...memes, ...quizzes].sort((a, b) => new Date(b.approvalDate) - new Date(a.approvalDate));
      const totalContent = allContent.length;
      const totalPages = Math.ceil(totalContent / itemsPerPage);
  
      const start = (pageNumber - 1) * itemsPerPage;
      const paginatedContent = allContent.slice(start, start + itemsPerPage);
  
      res.json({
        totalPages,
        currentPage: pageNumber,
        content: paginatedContent,
      });
    } catch (error) {
      console.error("Error fetching paginated content:", error);
      res.status(500).json({ message: "Failed to load paginated content" });
    }
  };
  
  const getAllContent = async (req, res) => {
    try {
        const films = await Film.find({ isApproved: true }); 
        const images = await Image.find({ isApproved: true }); 
        const memes = await Meme.find({ isApproved: true });
        const quizzes = await Quiz.find({ isApproved: true });

        res.status(200).json({ films, images, memes, quizzes }); // Send combined response
    } catch (error) {
        console.error("Error fetching content:", error);
        res.status(500).json({ message: 'Failed to retrieve content' });
    }
};

const getContentByCategory = async (req, res) => {
  const category = req.query.category; 
  //http://localhost:3000/content?category=cats

  if (!category) {
    return res.status(400).json({ message: "Category is required" });
  }

  try {
    const films = await getFilmsByCategory(category);
    const images = await getImagesByCategory(category);
    const memes = await getMemesByCategory(category);
    const quizzes = await getQuizzesByCategory(category);

    const allContent = [...films, ...images, ...memes, ...quizzes];

    res.json(allContent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching content by category", error });
  }
};

const getPendingContent = async (req, res) => {
  try {
    const films = await Film.find({ isApproved: false });
    const images = await Image.find({ isApproved: false });
    const memes = await Meme.find({ isApproved: false });
    const quizzes = await Quiz.find({ isApproved: false });

    res.status(200).json({ films, images, memes, quizzes });
  } catch (error) {
    console.error("Error fetching pending content:", error);
    res.status(500).json({ message: 'Failed to retrieve pending content' });
  }
};

module.exports = { getPaginatedContent, getAllContent, getContentByCategory, getPendingContent };