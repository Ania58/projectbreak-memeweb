const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    contentType: {
        type: String,
        enum: ['film', 'image', 'meme', 'quiz'],
        required: true
    },
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'contentType'
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    text: {
        type: String,
        required: true
    },
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null 
    },
}, { timestamps: true });


commentSchema.index({ contentType: 1, contentId: 1 });

module.exports = mongoose.model('Comment', commentSchema);