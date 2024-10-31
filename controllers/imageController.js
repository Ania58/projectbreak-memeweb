const Image = require('../models/Image');

const addImage = async (req, res) => {
    const { title, category, tags, agreements } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    try {
        const newImage = await Image.create({
            title,
            category,
            imageUrl,
            tags: tags.split(',').map(tag => tag.trim()), // Split tags into an array
            agreements
        });
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Error adding image:", error);
        res.status(500).json({ message: 'Failed to add image' });
    }
};

const getAllImages = async (req, res) => {
    try {
        const images = await Image.find();
        res.status(200).json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ message: "Failed to retrieve images" });
    }
};

module.exports = { addImage, getAllImages };