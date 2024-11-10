const Film = require('../models/Film');

const addFilm = async (req, res) => {
    const { title, category, filmCategory, description, tags, agreements, isApproved  } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    try {
        const newFilm = await Film.create({
            title,
            category,
            filmCategory,
            videoUrl, 
            description,
            tags: tags.split(',').map(tag => tag.trim()), 
            agreements,
            isApproved: isApproved !== undefined ? isApproved : false,
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


  const voteFilm = async (req, res) => {
    const { filmId } = req.params;
    const { vote } = req.body; 

    try {
        const update = vote === 1 ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
        const film = await Film.findByIdAndUpdate(filmId, update, { new: true });

        if (!film) return res.status(404).json({ message: "Film not found" });
        res.json({ upvotes: film.upvotes, downvotes: film.downvotes });
    } catch (error) {
        console.error("Error updating film vote:", error);
        res.status(500).json({ message: "Failed to update vote" });
    }
};

module.exports = { addFilm, getAllFilms, getFilmsByCategory, voteFilm };