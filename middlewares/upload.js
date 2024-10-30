const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Name files uniquely based on current date and original name
        cb(null, Date.now() + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

module.exports = upload;