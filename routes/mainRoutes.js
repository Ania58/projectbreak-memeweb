const express = require("express");
const router = express.Router();

const { getAllContent, getContentByCategory, getPendingContent, getPaginatedContent, searchContent, getContentById } = require('../controllers/mainController');
const { getAllFilms, getUserFilms } = require('../controllers/filmController');
const { getAllImages, getUserImages } = require('../controllers/imageController');
const { getAllMemes, getUserMemes } = require('../controllers/memeController');
const { getAllQuizzes, getUserQuizzes } = require('../controllers/quizController');
const { getTopContent } = require('../controllers/topContentController');
const  promoteContentToMain  = require('../middlewares/promoteContentToMain');
const verifyToken = require('../middlewares/auth')

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



module.exports = router;