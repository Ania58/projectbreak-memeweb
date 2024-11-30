const express = require('express');
const upload = require('../middlewares/upload');
const { addFilm, editFilm, deleteFilm, voteFilm  } = require('../controllers/filmController');
const verifyToken = require('../middlewares/auth');
const router = express.Router();

router.post('/films', upload.single('file'), addFilm); 

router.post('/add/films', verifyToken, upload.single('file'), addFilm);

router.put('/films/:id', verifyToken, editFilm); 

router.put('/user/films/:id', verifyToken, editFilm);

router.delete('/films/:id', verifyToken, deleteFilm);

router.delete('/user/films/:id', verifyToken, deleteFilm);

router.post('/films/:filmId/vote', voteFilm);

module.exports = router;