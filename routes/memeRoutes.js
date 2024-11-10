const express = require('express');
const upload = require('../middlewares/upload'); 
const { addAdminMeme, addUserGeneratedMeme, voteMeme } = require('../controllers/memeController');
const router = express.Router();


router.post('/memes', upload.single('file'), addAdminMeme);

router.post('/add/meme', addUserGeneratedMeme); 

router.post('/memes/:memeId/vote', voteMeme);

module.exports = router;