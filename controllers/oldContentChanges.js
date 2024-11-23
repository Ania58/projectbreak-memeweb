const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');

async function approveOldContent() {
    try {
        await Film.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
        //console.log('Films updated');

        await Image.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
        //console.log('Images updated');

        await Meme.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
        //console.log('Memes updated');

        await Quiz.updateMany({ isApproved: { $exists: false } }, { $set: { isApproved: true } });
        //console.log('Quizzes updated');

    } catch (error) {
        console.error('Error updating old content:', error);
    }
}


module.exports = { approveOldContent }