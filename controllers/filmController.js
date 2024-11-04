const Film = require('../models/Film');

const addFilm = async (req, res) => {
    const { title, category, filmCategory, description, tags, agreements } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    try {
        const newFilm = await Film.create({
            title,
            category,
            filmCategory,
            videoUrl, 
            description,
            tags: tags.split(',').map(tag => tag.trim()), 
            agreements
        });
        res.status(201).json(newFilm);
    } catch (error) {
        console.error("Error adding film:", error);
        res.status(500).json({ message: 'Failed to add film' });
    }
};

const getAllFilms = async (req, res) => {
    try {
        const films = await Film.find();  // Retrieve all films
        res.status(200).json(films);
    } catch (error) {
        console.error("Error fetching films:", error);
        res.status(500).json({ message: 'Failed to retrieve films' });
    }
};

const getFilmsByCategory = async (category) => {
    return await Film.find({ category });
  };

module.exports = { addFilm, getAllFilms, getFilmsByCategory };