const express = require('express');
const { addComment, getComments, editComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();

router.post('/comments', addComment);

router.get('/comments/:contentType/:contentId', getComments);

router.put('/comments/:commentId', editComment);

router.delete('/comments/:commentId', deleteComment);

module.exports = router;