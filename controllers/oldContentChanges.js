const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');

async function approveOldContent() {
    try {
        await Film.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });

        await Image.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
      
        await Meme.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
       
        await Quiz.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
        
    } catch (error) {
        console.error('Error updating old content:', error);
    }
}

const updateOldContent = async () => {
    const now = new Date();
    try {
      await Film.updateMany({ lastVotedAt: { $exists: false } }, { $set: { lastVotedAt: now } });

      await Image.updateMany({ lastVotedAt: { $exists: false } }, { $set: { lastVotedAt: now } });

      await Meme.updateMany({ lastVotedAt: { $exists: false } }, { $set: { lastVotedAt: now } });

      await Quiz.updateMany({ lastVotedAt: { $exists: false } }, { $set: { lastVotedAt: now } });
     
    } catch (error) {
      console.error('Error updating old content:', error);
    }
  };
  


module.exports = { approveOldContent, updateOldContent }