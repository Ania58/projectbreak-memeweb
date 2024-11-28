const Quiz = require('../models/Quiz');

const addQuiz = async (req, res) => {
  try {
    //console.log('Incoming request body:', req.body);
    //console.log('Uploaded file:', req.file);

    if (!req.user || !req.user.uid) {
      return res.status(403).json({ message: "Unauthorized: User ID missing" });
    }
    
    let questions = req.body.questions;
    if (typeof questions === 'string') {
      questions = JSON.parse(questions);
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'A quiz must have at least one question.' });
    }

    questions.forEach((question, index) => {
      if (!question.questionText) {
        throw new Error(`Question ${index + 1} must have text.`);
      }
      if (!question.answers || question.answers.length < 2) {
        throw new Error(`Question ${index + 1} must have at least two answers.`);
      }
      const correctAnswers = question.answers.filter((answer) => answer.isCorrect);
      if (correctAnswers.length === 0) {
        throw new Error(`Question ${index + 1} must have at least one correct answer.`);
      }
    });

    const newQuiz = await Quiz.create({
      title: req.body.title,
      category: req.body.category,
      questions,
      imageUrl: `/uploads/${req.file.filename}`, 
      tags: req.body.tags.split(',').map((tag) => tag.trim()), 
      agreements: {
        rulesAccepted: req.body.rulesAccepted === 'true' || req.body.rulesAccepted === true,
        copyrightsAccepted: req.body.copyrightsAccepted === 'true' || req.body.copyrightsAccepted === true,
      },
      isApproved: req.body.isApproved !== undefined ? req.body.isApproved : false,
      userId: req.user.uid,
    });

    res.status(201).json({ message: 'Quiz added successfully', newQuiz });
  } catch (error) {
    console.error('Error adding quiz:', error.message || error);
    res.status(400).json({ message: error.message || 'Failed to add quiz' });
  }
};

const editQuiz = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedQuiz) return res.status(404).json({ message: 'Quiz not found' });
      res.status(200).json(updatedQuiz);
    } catch (error) {
      console.error('Error editing quiz:', error);
      res.status(500).json({ message: 'Failed to edit quiz' });
    }
  };
  
  const deleteQuiz = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(id);
      if (!deletedQuiz) return res.status(404).json({ message: 'Quiz not found' });
      res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Failed to delete quiz' });
    }
  };

const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ message: "Failed to retrieve quizzes" });
    }
};

const getQuizzesByCategory = async (category) => {
    return await Quiz.find({ category });
  };

  const voteQuiz = async (req, res) => {
    const { quizId } = req.params;
    const { vote } = req.body;

    try {
        const update = vote === 1 ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
        const quiz = await Quiz.findByIdAndUpdate(quizId, update, { new: true });

        if (!quiz) return res.status(404).json({ message: "Quiz not found" });
        res.json({ upvotes: quiz.upvotes, downvotes: quiz.downvotes });
    } catch (error) {
        console.error("Error updating quiz vote:", error);
        res.status(500).json({ message: "Failed to update vote" });
    }
};

module.exports = { addQuiz, editQuiz, deleteQuiz, getAllQuizzes, getQuizzesByCategory, voteQuiz };