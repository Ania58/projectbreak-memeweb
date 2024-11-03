const Quiz = require('../models/Quiz');


const addQuiz = async (req, res) => {
    const { title, category, questions, tags, agreements } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 
    //console.log(req.body); 
    //console.log({ agreements }); 
    //console.log("Request body:", req.body);
    //console.log("Uploaded files:", req.files);
    

    try {
        const processedQuestions = questions.map(question => ({
            questionText: question.questionText,
            imageUrl: question.imageUrl || null, 
            answers: question.answers.map(answer => ({
                answerText: answer.answerText,
                isCorrect: answer.isCorrect
            }))
        }));

        const newQuiz = await Quiz.create({
            title,
            category,
            questions:processedQuestions,
            imageUrl, 
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], 
            agreements
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error("Error adding quiz:", error);
        res.status(500).json({ message: 'Failed to add quiz' });
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

module.exports = { addQuiz, getAllQuizzes };