const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');


async function promoteContentToMain(req, res, next) {
    const minUpvotes = 10;
    const ratio = 3;

    const contentTypes = [Film, Image, Meme, Quiz]; 

    try {
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
        next(); 
    } catch (error) {
        console.error("Error in promoteContentToMain middleware:", error);
        next(error); 
    }
}

module.exports = promoteContentToMain;