const express = require('express');
const upload = require('../middlewares/upload'); 
const { addAdminMeme, addUserGeneratedMeme, editMeme, deleteMeme, voteMeme } = require('../controllers/memeController');
const verifyToken = require('../middlewares/auth');
const router = express.Router();


router.post('/memes', upload.single('file'), addAdminMeme);

router.post('/add/memes', verifyToken, addUserGeneratedMeme); 

router.put('/memes/:id', verifyToken, editMeme); 

router.delete('/memes/:id', verifyToken, deleteMeme);

router.post('/memes/:memeId/vote', voteMeme);

module.exports = router;