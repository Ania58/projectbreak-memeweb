const express = require('express');
const { addImage } = require('../controllers/imageController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/add', upload.single('file'), addImage);

module.exports = router;