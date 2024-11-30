const express = require('express');
const upload = require('../middlewares/upload'); 
const { addQuiz, editQuiz, deleteQuiz, voteQuiz } = require('../controllers/quizController');
const verifyToken = require('../middlewares/auth');
const router = express.Router();


router.post('/quizzes', upload.single('file'), addQuiz);

router.post('/add/quizzes', verifyToken, upload.single('file'), addQuiz);

router.put('/quizzes/:id', verifyToken, editQuiz); 

router.put('/user/quizzes/:id', verifyToken, editQuiz);

router.delete('/quizzes/:id', verifyToken, deleteQuiz); 

router.post('/quizzes/:quizId/vote', voteQuiz);

module.exports = router;