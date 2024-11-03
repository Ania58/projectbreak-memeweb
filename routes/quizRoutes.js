const express = require('express');
const upload = require('../middlewares/upload'); 
const { addQuiz } = require('../controllers/quizController');
const router = express.Router();


router.post('/quizzes', upload.single('file'), addQuiz);

module.exports = router;