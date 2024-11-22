const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');
const Comment = require('../models/Comment');


const { getFilmsByCategory } = require('./filmController');
const { getImagesByCategory } = require('./imageController');
const { getMemesByCategory } = require('./memeController');
const { getQuizzesByCategory } = require('./quizController');


  const getPaginatedContent = async (req, res) => {
    const pageNumber = parseInt(req.params.pageNumber) || 1;
    const itemsPerPage = 8;
    
    try {

      const films = (await Film.find({ isApproved: true })).map(item => ({ ...item.toObject(), type: 'film' }));
      const images = (await Image.find({ isApproved: true })).map(item => ({ ...item.toObject(), type: 'image' }));
      const memes = (await Meme.find({ isApproved: true })).map(item => ({ ...item.toObject(), type: 'meme' }));
      const quizzes = (await Quiz.find({ isApproved: true })).map(item => ({ ...item.toObject(), type: 'quiz' }));
  
      const allContent = [...films, ...images, ...memes, ...quizzes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const totalContent = allContent.length;
      const totalPages = Math.ceil(totalContent / itemsPerPage);
  
      //const start = (pageNumber - 1) * itemsPerPage;
      const start = (totalPages - pageNumber) * itemsPerPage;
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

const searchContent = async (req, res) => {
  const query = req.query.query;

  try {
    /*const films = await Film.find({
      $or: [
        { category: query },
        { filmCategory: query },
        { tags: { $in: [query] } }
      ]
    });
    
    const images = await Image.find({
      $or: [
        { category: query },
        { tags: { $in: [query] } }
      ]
    });
    
    const memes = await Meme.find({
      $or: [
        { category: query },
        { tags: { $in: [query] } }
      ]
    });
    
    const quizzes = await Quiz.find({
      $or: [
        { category: query },
        { tags: { $in: [query] } }
      ]
    });*/

    const regexQuery = new RegExp(query, 'i'); // case-insensitive 

    const films = await Film.find({
      $or: [
        { category: { $regex: regexQuery } },
        { filmCategory: { $regex: regexQuery } },
        { tags: { $elemMatch: { $regex: regexQuery } } }
      ]
    });

    const images = await Image.find({
      $or: [
        { category: { $regex: regexQuery } },
        { tags: { $elemMatch: { $regex: regexQuery } } }
      ]
    });

    const memes = await Meme.find({
      $or: [
        { category: { $regex: regexQuery } },
        { tags: { $elemMatch: { $regex: regexQuery } } }
      ]
    });

    const quizzes = await Quiz.find({
      $or: [
        { category: { $regex: regexQuery } },
        { tags: { $elemMatch: { $regex: regexQuery } } }
      ]
    });

    
    const allContent = [...films, ...images, ...memes, ...quizzes];

    res.json({ content: allContent });
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Failed to fetch search results" });
  }
};

const getContentById = async (req, res) => {
  const { id } = req.params;

  try {
      let content = null;
      let type = null;

      content = await Film.findById(id);
      if (content) {
          type = 'film';
      }

      if (!content) {
          content = await Image.findById(id);
          if (content) {
              type = 'image';
          }
      }

      if (!content) {
          content = await Meme.findById(id);
          if (content) {
              type = 'meme';
          }
      }

      if (!content) {
          content = await Quiz.findById(id);
          if (content) {
              type = 'quiz';
          }
      }

      if (!content) {
          return res.status(404).json({ message: 'Content not found.' });
      }

      content = content.toObject();
      content.type = type;

      const comments = await Comment.find({ contentType: type, contentId: id }).sort({ createdAt: -1 });

      const commentMap = {};
      comments.forEach(comment => {
          comment = comment.toObject();
          comment.replies = [];
          commentMap[comment._id] = comment;
      });

      const rootComments = [];
      comments.forEach(comment => {
          if (comment.parentCommentId) {
              if (commentMap[comment.parentCommentId]) {
                  commentMap[comment.parentCommentId].replies.push(comment);
              }
          } else {
              rootComments.push(comment);
          }
      });

      content.comments = rootComments;

      res.status(200).json(content);
  } catch (error) {
      console.error('Error fetching content by ID:', error);
      res.status(500).json({ message: 'Failed to retrieve content.' });
  }
};

module.exports = { getPaginatedContent, getAllContent, getContentByCategory, getPendingContent, searchContent, getContentById };