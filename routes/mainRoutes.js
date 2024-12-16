const express = require("express");
const router = express.Router();

const { getAllContent, getContentByCategory, getPendingContent, getPaginatedContent, searchContent, getContentById, proxyImage } = require('../controllers/mainController');
const { getAllFilms, getUserFilms } = require('../controllers/filmController');
const { getAllImages, getUserImages } = require('../controllers/imageController');
const { getAllMemes, getUserMemes } = require('../controllers/memeController');
const { getAllQuizzes, getUserQuizzes } = require('../controllers/quizController');
const { getTopContent } = require('../controllers/topContentController');
const  promoteContentToMain  = require('../middlewares/promoteContentToMain');
const verifyToken = require('../middlewares/auth')

router.get("/proxy/get-memes", async (req, res) => {
    try {
      const response = await axios.get("https://api.imgflip.com/get_memes");
      res.json(response.data);
    } catch (error) {
      console.error("Error fetching memes:", error.message);
      res.status(500).json({ message: "Failed to fetch memes." });
    }
  });

router.get('/', getAllContent);

router.get('/films', getAllFilms);

router.get('/user/films', verifyToken, getUserFilms);

router.get('/images', getAllImages);

router.get('/user/images', verifyToken, getUserImages);

router.get('/memes', getAllMemes);

router.get('/user/memes', verifyToken, getUserMemes);

router.get('/quizzes', getAllQuizzes);

router.get('/user/quizzes', verifyToken, getUserQuizzes);

router.get('/content', getContentByCategory);

router.get('/content/search', searchContent);

router.get('/content/page/:pageNumber', getPaginatedContent); 

router.get('/content/:id', getContentById); 

router.get('/pending',  promoteContentToMain, getPendingContent);

router.get('/top', getTopContent);

router.get('/proxy/image', proxyImage);



module.exports = router;