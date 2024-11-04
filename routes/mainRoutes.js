const express = require("express");
const router = express.Router();

/*router.get('/', memeController.getMemes);
router.get('/page/:pageNumber', memeController.getPaginatedMemes);*/

//router.get('/', memeController.getAllImages)

const { getAllContent, getContentByCategory } = require('../controllers/mainController');
const { getAllFilms } = require('../controllers/filmController');
const { getAllImages } = require('../controllers/imageController');
const { getAllMemes } = require('../controllers/memeController');
const { getAllQuizzes } = require('../controllers/quizController');

router.get('/', getAllContent);

router.get('/films', getAllFilms);

router.get('/images', getAllImages);

router.get('/memes', getAllMemes);

router.get('/quizzes', getAllQuizzes);

router.get('/content', getContentByCategory);


module.exports = router;