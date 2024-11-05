const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');

async function promoteContentToMain() {
    const minUpvotes = 10;
    const ratio = 3;

    const contentTypes = [Film, Image, Meme, Quiz]; 

    for (const ContentType of contentTypes) {
        const contentList = await ContentType.find({ isApproved: false });

        for (const content of contentList) {
            const { upvotes, downvotes } = content;

            if (upvotes >= minUpvotes && upvotes >= downvotes * ratio) {
                content.isApproved = true; 
                await content.save(); 
            }
        }
    }
    console.log("Content promotion check completed");
}

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


module.exports = { promoteContentToMain, approveOldContent }