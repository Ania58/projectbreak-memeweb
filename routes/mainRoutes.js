const express = require("express");
const router = express.Router();

/*router.get('/', memeController.getMemes);
router.get('/page/:pageNumber', memeController.getPaginatedMemes);*/

//router.get('/', memeController.getAllImages)

const { getAllContent, getContentByCategory, getPendingContent, getPaginatedContent, searchContent, getContentById } = require('../controllers/mainController');
const { getAllFilms } = require('../controllers/filmController');
const { getAllImages } = require('../controllers/imageController');
const { getAllMemes } = require('../controllers/memeController');
const { getAllQuizzes } = require('../controllers/quizController');
const { getTopContent } = require('../controllers/topContentController');
const  promoteContentToMain  = require('../middlewares/promoteContentToMain')

router.get('/', getAllContent);

router.get('/films', getAllFilms);

router.get('/images', getAllImages);

router.get('/memes', getAllMemes);

router.get('/quizzes', getAllQuizzes);

router.get('/content', getContentByCategory);

router.get('/content/search', searchContent);

router.get('/content/page/:pageNumber', getPaginatedContent); 

router.get('/content/:id', getContentById); //if I have authentication done, here goes a middleware (comment only for the logged ones)

router.get('/pending',  promoteContentToMain, getPendingContent);

router.get('/top', getTopContent);



module.exports = router;