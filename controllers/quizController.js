const Quiz = require('../models/Quiz');


const addQuiz = async (req, res) => {
    const { title, category, questions, tags, agreements, isApproved } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 
    //console.log(req.body); 
    //console.log({ agreements }); 
    //console.log("Request body:", req.body);
    //console.log("Uploaded files:", req.files);
    
    

    try {
        const processedQuestions = questions.map(question => ({
            questionText: question.questionText,
            answers: question.answers.map(answer => ({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect
            }))
        }));
        //console.log(processedQuestions)
        const newQuiz = await Quiz.create({
            title,
            category,
            questions:processedQuestions,
            imageUrl, 
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], 
            agreements,
            isApproved: isApproved !== undefined ? isApproved : false
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Error adding quiz:", error);
        res.status(500).json({ message: 'Failed to add quiz' });
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