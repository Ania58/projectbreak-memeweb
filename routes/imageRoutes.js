const express = require('express');
const { addImage, editImage, deleteImage, voteImage } = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const router = express.Router();


router.post('/images', upload.single('file'), addImage); 

router.post('/add/images', upload.single('file'), addImage);

router.put('/images/:id', editImage); 

router.delete('/images/:id', deleteImage);

router.post('/images/:imageId/vote', voteImage);

module.exports = router;