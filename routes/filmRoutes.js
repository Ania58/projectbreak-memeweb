const express = require('express');
const upload = require('../middlewares/upload');
const { addFilm } = require('../controllers/filmController');
const router = express.Router();

router.post('/films', upload.single('file'), addFilm); 

module.exports = router;