const Film = require('../models/Film');
const Image = require('../models/Image');
const Meme = require('../models/Meme');
const Quiz = require('../models/Quiz');

const getTopContent = async (req, res) => {
  const { timeframe } = req.query;

  let dateFilter = {};
  if (timeframe === 'lastWeek') {
    dateFilter = { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (timeframe === 'last48h') {
    dateFilter = { createdAt: { $gte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } };
  } else if (timeframe === 'last24h') {
    dateFilter = { createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
  }

  try {
    const [films, images, memes, quizzes] = await Promise.all([
      Film.find(dateFilter).sort({ upvotes: -1 }).limit(10),
      Image.find(dateFilter).sort({ upvotes: -1 }).limit(10),
      Meme.find(dateFilter).sort({ upvotes: -1 }).limit(10),
      Quiz.find(dateFilter).sort({ upvotes: -1 }).limit(10),
    ]);

    const allContent = [...films, ...images, ...memes, ...quizzes];
    allContent.sort((a, b) => b.upvotes - a.upvotes);

    res.status(200).json(allContent.slice(0, 10)); 
  } catch (error) {
    console.error('Error fetching top content:', error);
    res.status(500).json({ message: 'Failed to fetch top content' });
  }
};

module.exports = { getTopContent };