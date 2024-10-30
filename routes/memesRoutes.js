const express = require("express");
const router = express.Router();
const memeController = require('../controllers/memeControllers')


router.get('/', memeController.getMemes);
router.get('/page/:pageNumber', memeController.getPaginatedMemes);



module.exports = router;