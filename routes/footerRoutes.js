const express = require('express');
const router = express.Router();

const { handleContactForm, handleAdvertisementForm} = require('../controllers/footerController');

router.post('/contact', handleContactForm);
router.post('/advertisement', handleAdvertisementForm);

module.exports = router;