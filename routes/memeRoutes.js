const express = require('express');
const upload = require('../middlewares/upload'); 
const { addAdminMeme, addUserGeneratedMeme, editMeme, deleteMeme, voteMeme } = require('../controllers/memeController');
const router = express.Router();


router.post('/memes', upload.single('file'), addAdminMeme);

router.post('/add/meme', addUserGeneratedMeme); 

router.put('/memes/:id', editMeme); 

router.delete('/memes/:id', deleteMeme);

router.post('/memes/:memeId/vote', voteMeme);

module.exports = router;