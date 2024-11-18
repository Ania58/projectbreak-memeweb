const Comment = require('../models/Comment');

const addComment = async (req, res) => {
    const { contentType, contentId, parentCommentId, text } = req.body;

    if (!contentType || !contentId || !text) {
        return res.status(400).json({ message: 'contentType, contentId, and text are required.' });
    }

    const allowedTypes = ['film', 'image', 'meme', 'quiz'];
    if (!allowedTypes.includes(contentType)) {
        return res.status(400).json({ message: 'Invalid contentType provided.' });
    }

    try {
        const newCommentData = {
            contentType,
            contentId,
            parentCommentId: parentCommentId || null,
            text
        };

        if (req.user && req.user.id) {
            newCommentData.userId = req.user.id;
        }

        const newComment = await Comment.create(newCommentData);

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment.' });
    }
};

const getComments = async (req, res) => {
    const { contentType, contentId } = req.params;

    const allowedTypes = ['film', 'image', 'meme', 'quiz'];
    if (!allowedTypes.includes(contentType)) {
        return res.status(400).json({ message: 'Invalid contentType provided.' });
    }

    try {
        const comments = await Comment.find({ contentType, contentId }).sort({ createdAt: -1 });

        const commentMap = {};
        comments.forEach(comment => {
            comment = comment.toObject();
            comment.replies = [];
            commentMap[comment._id] = comment;
        });

        const rootComments = [];
        comments.forEach(comment => {
            if (comment.parentCommentId) {
                if (commentMap[comment.parentCommentId]) {
                    commentMap[comment.parentCommentId].replies.push(comment);
                }
            } else {
                rootComments.push(comment);
            }
        });

        res.status(200).json(rootComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Failed to retrieve comments.' });
    }
};

module.exports = { addComment, getComments };