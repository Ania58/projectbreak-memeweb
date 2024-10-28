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
    type: String, // URL to the image (to be handled by the upload service)
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

module.exports = mongoose.model('Image', imageSchema);