const express = require('express');
const { addImage, voteImage } = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const router = express.Router();


router.post('/images', upload.single('file'), addImage); 
router.post('/images/:imageId/vote', voteImage);

module.exports = router;