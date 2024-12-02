const express = require('express');
const { addComment, getComments, editComment, deleteComment } = require('../controllers/commentController');
const verifyToken = require('../middlewares/auth')
const router = express.Router();

router.post('/comments', verifyToken, addComment);

router.get('/comments/:contentType/:contentId', getComments);

router.put('/comments/:commentId', verifyToken, editComment);

router.delete('/comments/:commentId', verifyToken, deleteComment);

module.exports = router;