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

const editComment = async (req, res) => {
    const { commentId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ message: 'Text is required to edit the comment.' });
    }

    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { text, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedComment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error('Error editing comment:', error);
        res.status(500).json({ message: 'Failed to edit comment.' });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        comment.text = '[Deleted]';
        await comment.save();

        res.status(200).json({ message: 'Comment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ message: 'Failed to delete comment.' });
    }
};

module.exports = { addComment, getComments, editComment, deleteComment };