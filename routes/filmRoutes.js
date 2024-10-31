const express = require('express');
const { addFilm, getAllFilms } = require('../controllers/filmController');
const router = express.Router();

router.post('/', addFilm);
router.get('/', getAllFilms)

module.exports = router;