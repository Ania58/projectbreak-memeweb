const express = require('express');
const upload = require('../middlewares/upload'); 
const { addQuiz, voteQuiz } = require('../controllers/quizController');
const router = express.Router();


router.post('/quizzes', upload.single('file'), addQuiz);

router.post('/quizzes/:quizId/vote', voteQuiz);

module.exports = router;