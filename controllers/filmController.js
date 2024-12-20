const Film = require('../models/Film');

const addFilm = async (req, res) => {
    const { title, category, filmCategory, description, tags, agreements, isApproved  } = req.body;
    const videoUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    try {
        if (!req.user || !req.user.uid) {
          return res.status(401).json({ message: "User not authenticated" });
      }
        const newFilm = await Film.create({
            title,
            category,
            filmCategory,
            videoUrl, 
            description,
            tags: tags.split(',').map(tag => tag.trim()), 
            agreements : {
              rulesAccepted: req.body['agreements.rulesAccepted'] === 'true', 
              copyrightsAccepted: req.body['agreements.copyrightsAccepted'] === 'true',
          },
            isApproved: isApproved !== undefined ? isApproved : false,
            userId: req.user.uid,
        });
        res.status(201).json(newFilm);
    } catch (error) {
        console.error("Error adding film:", error);
        res.status(500).json({ message: 'Failed to add film' });
    }
};

const editFilm = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {

      const film = await Film.findById(id);
        if (!film) return res.status(404).json({ message: 'Film not found' });

        if (film.userId !== req.user.uid) {
            return res.status(403).json({ message: 'Unauthorized: You can only edit your own films.' });
        }

      const updatedFilm = await Film.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedFilm) return res.status(404).json({ message: 'Film not found' });
      res.status(200).json(updatedFilm);
    } catch (error) {
      console.error('Error editing film:', error);
      res.status(500).json({ message: 'Failed to edit film' });
    }
  };
  
  const deleteFilm = async (req, res) => {
    const { id } = req.params;
  
    try {

      const film = await Film.findById(id);
      if (!film) return res.status(404).json({ message: 'Film not found' });

      if (film.userId !== req.user.uid) {
          return res.status(403).json({ message: 'Unauthorized: You can only delete your own films.' });
      }

      await film.deleteOne();

      res.status(200).json({ message: 'Film deleted successfully' });
    } catch (error) {
      console.error('Error deleting film:', error);
      res.status(500).json({ message: 'Failed to delete film' });
    }
  };

const getAllFilms = async (req, res) => {
    try {
        const films = await Film.find();  
        res.status(200).json(films);
    } catch (error) {
        console.error("Error fetching films:", error);
        res.status(500).json({ message: 'Failed to retrieve films' });
    }
};

const getFilmsByCategory = async (category) => {
    return await Film.find({ category });
  };


  const getUserFilms = async (req, res) => {
    try {
      const userId = req.user.uid;
      const films = await Film.find({ userId });
      res.status(200).json(films);
    } catch (error) {
      console.error("Error fetching user's films:", error);
      res.status(500).json({ message: "Failed to retrieve user's films" });
    }
  };

  const voteFilm = async (req, res) => {
    const { filmId } = req.params;
    const { vote } = req.body; 

    try {
       
        const update = vote === 1 
            ? { $inc: { upvotes: 1 }, $set: { lastVotedAt: new Date() } }
            : { $inc: { downvotes: 1 }, $set: { lastVotedAt: new Date() } };
            
        const film = await Film.findByIdAndUpdate(filmId, update, { new: true });

        if (!film) return res.status(404).json({ message: "Film not found" });
        res.json({ upvotes: film.upvotes, downvotes: film.downvotes });
    } catch (error) {
        console.error("Error updating film vote:", error);
        res.status(500).json({ message: "Failed to update vote" });
    }
};

module.exports = { addFilm, editFilm, deleteFilm, getAllFilms, getFilmsByCategory, getUserFilms, voteFilm };