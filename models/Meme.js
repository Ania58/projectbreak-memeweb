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
  imageUrl: { // for admin-uploaded memes
    type: String,
    required: function() { return !this.isUserGenerated; }
  },
  templateId: {
    type: String, 
    required: function() { return this.isUserGenerated; }
  },
  topText: {
    type: String,
    required: function() { return this.isUserGenerated; }
  },
  bottomText: {
    type: String,
    required: function() { return this.isUserGenerated; }
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
  isUserGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   upvotes: { type: Number, default: 0 },
   downvotes: { type: Number, default: 0 },
   isApproved: { type: Boolean, default: false },
   userId: { type: String, required: true },
});

module.exports = mongoose.model('Meme', memeSchema);