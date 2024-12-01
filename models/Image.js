const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: [
      'animals', 'humor', 'videos', 'memes', 'comics', 'curiosities', 'food', 
      'politics', 'culture', 'sport', 'popculture', 'history', 'war', 'WTF', 
      'cats', 'emotions', 'art', 'nature', 'music and film', 'news', 'dogs', 
      'motorization'
    ],
    required: true
  },
  imageUrl: {
    type: String, 
    required: true
  },
  tags: {
    type: [String]
  },
  agreements: {
    rulesAccepted: {
      type: Boolean,
      required: true
    },
    copyrightsAccepted: {
      type: Boolean,
      required: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   upvotes: { type: Number, default: 0 },
   downvotes: { type: Number, default: 0 },
   lastVotedAt: { type: Date },
   isApproved: { type: Boolean, default: false },
   userId: { type: String, required: true },
});

module.exports = mongoose.model('Image', imageSchema);