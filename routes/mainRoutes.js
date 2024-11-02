const express = require("express");
const router = express.Router();

/*router.get('/', memeController.getMemes);
router.get('/page/:pageNumber', memeController.getPaginatedMemes);*/

//router.get('/', memeController.getAllImages)

const { getAllContent } = require('../controllers/mainController');
const { getAllFilms } = require('../controllers/filmController');
const { getAllImages } = require('../controllers/imageController');

router.get('/', getAllContent);

router.get('/films', getAllFilms);

router.get('/images', getAllImages);


module.exports = router;