const Image = require('../models/Image');

const addImage = async (req, res) => {
    const { title, category, tags, agreements, isApproved } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; 

    try {
      const agreements = {
        rulesAccepted: req.body['agreements.rulesAccepted'] === 'true',
        copyrightsAccepted: req.body['agreements.copyrightsAccepted'] === 'true',
    };
        const newImage = await Image.create({
            title,
            category,
            imageUrl,
            tags: tags.split(',').map(tag => tag.trim()), // Split tags into an array
            agreements,
            isApproved: isApproved !== undefined ? isApproved : false
        });
        res.status(201).json(newImage);
    } catch (error) {
        console.error("Error adding image:", error);
        res.status(500).json({ message: 'Failed to add image' });
    }
};

const editImage = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    try {
      const updatedImage = await Image.findByIdAndUpdate(id, updates, { new: true });
      if (!updatedImage) return res.status(404).json({ message: 'Image not found' });
      res.status(200).json(updatedImage);
    } catch (error) {
      console.error('Error editing image:', error);
      res.status(500).json({ message: 'Failed to edit image' });
    }
  };
  

  const deleteImage = async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedImage = await Image.findByIdAndDelete(id);
      if (!deletedImage) return res.status(404).json({ message: 'Image not found' });
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ message: 'Failed to delete image' });
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

const getImagesByCategory = async (category) => {
    return await Image.find({ category });
  };

  const voteImage = async (req, res) => {
    const { imageId } = req.params;
    const { vote } = req.body; 

    try {
        const update = vote === 1 ? { $inc: { upvotes: 1 } } : { $inc: { downvotes: 1 } };
        const image = await Image.findByIdAndUpdate(imageId, update, { new: true });

        if (!image) return res.status(404).json({ message: "Image not found" });
        res.json({ upvotes: image.upvotes, downvotes: image.downvotes });
    } catch (error) {
        console.error("Error updating image vote:", error);
        res.status(500).json({ message: "Failed to update vote" });
    }
};


module.exports = { addImage, editImage, deleteImage, getAllImages, getImagesByCategory, voteImage };