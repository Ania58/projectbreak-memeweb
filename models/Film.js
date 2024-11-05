const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
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
  filmCategory: {
    type: String,
    enum: ['humor', 'wow', 'curiosities', 'popculture', 'youtubers', 'fail', 'games', 'WTF', 'wholesome'],
    required: true
  },
  videoUrl: {
    type: String, 
    required: true
  },
  description: {
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
   isApproved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Film', filmSchema);