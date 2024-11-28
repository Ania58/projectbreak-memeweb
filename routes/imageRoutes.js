const express = require('express');
const { addImage, editImage, deleteImage, voteImage } = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/auth');
const router = express.Router();


router.post('/images', upload.single('file'), addImage); 

router.post('/add/images', verifyToken, upload.single('file'), addImage);

router.put('/images/:id', verifyToken, editImage); 

router.delete('/images/:id', verifyToken, deleteImage);

router.post('/images/:imageId/vote', voteImage);

module.exports = router;