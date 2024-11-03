const express = require('express');
const upload = require('../middlewares/upload'); 
const { addAdminMeme, addUserGeneratedMeme } = require('../controllers/memeController');
const router = express.Router();


router.post('/memes', upload.single('file'), addAdminMeme);

router.post('/add/meme', addUserGeneratedMeme); 

module.exports = router;