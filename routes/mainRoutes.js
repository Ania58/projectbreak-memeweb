const express = require("express");
const router = express.Router();

/*router.get('/', memeController.getMemes);
router.get('/page/:pageNumber', memeController.getPaginatedMemes);*/

//router.get('/', memeController.getAllImages)

const { getAllContent, getContentByCategory, getPendingContent, getPaginatedContent } = require('../controllers/mainController');
const { getAllFilms } = require('../controllers/filmController');
const { getAllImages } = require('../controllers/imageController');
const { getAllMemes } = require('../controllers/memeController');
const { getAllQuizzes } = require('../controllers/quizController');
const { promoteContentToMain } = require('../controllers/contentMainController'); 

router.get('/', getAllContent);

router.get('/films', getAllFilms);

router.get('/images', getAllImages);

router.get('/memes', getAllMemes);

router.get('/quizzes', getAllQuizzes);

router.get('/content', getContentByCategory);

router.get('/content/page/:pageNumber', getPaginatedContent); 

router.get('/pending', getPendingContent, promoteContentToMain);


module.exports = router;