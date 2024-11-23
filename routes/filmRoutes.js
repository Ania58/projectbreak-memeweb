const express = require('express');
const upload = require('../middlewares/upload');
const { addFilm, editFilm, deleteFilm, voteFilm  } = require('../controllers/filmController');
const router = express.Router();

router.post('/films', upload.single('file'), addFilm); 

router.post('/add/films', upload.single('file'), addFilm);

router.put('/films/:id', editFilm); 

router.delete('/films/:id', deleteFilm);

router.post('/films/:filmId/vote', voteFilm);

module.exports = router;