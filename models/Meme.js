const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
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
  templateId: {
    type: String, 
    required: true
  },
  topText: {
    type: String,
    required: true
  },
  bottomText: {
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
  }
});

module.exports = mongoose.model('Meme', memeSchema);