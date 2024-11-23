const express = require('express');
const upload = require('../middlewares/upload'); 
const { addQuiz, editQuiz, deleteQuiz, voteQuiz } = require('../controllers/quizController');
const router = express.Router();


router.post('/quizzes', upload.single('file'), addQuiz);

router.post('/#add/quizzes', upload.single('file'), addQuiz);

router.put('/quizzes/:id', editQuiz); 

router.delete('/quizzes/:id', deleteQuiz); 

router.post('/quizzes/:quizId/vote', voteQuiz);

module.exports = router;