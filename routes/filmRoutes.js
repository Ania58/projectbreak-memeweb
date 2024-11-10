const express = require('express');
const upload = require('../middlewares/upload');
const { addFilm, voteFilm  } = require('../controllers/filmController');
const router = express.Router();

router.post('/films', upload.single('file'), addFilm); 
router.post('/films/:filmId/vote', voteFilm);

module.exports = router;