const express = require('express');
const { addImage, getAllImages } = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const { get } = require('mongoose');
const router = express.Router();

router.post('/', upload.single('file'), addImage);
router.get('/', getAllImages)

module.exports = router;