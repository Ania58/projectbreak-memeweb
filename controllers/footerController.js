const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const handleContactForm = async (req, res) => {
  const { nameOrCompany, email, message } = req.body;

  if (!nameOrCompany || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const mailOptions = {
    from: email,
    to: 'biuro@lolture.com', 
    subject: `New Contact Form Submission from ${nameOrCompany}`,
    text: `Name/Company: ${nameOrCompany}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
};

const handleAdvertisementForm = async (req, res) => {
  const { nameOrCompany, email, message } = req.body;

  if (!nameOrCompany || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const mailOptions = {
    from: email,
    to: 'advertisements@lolture.com', 
    subject: `New Advertisement Inquiry from ${nameOrCompany}`,
    text: `Name/Company: ${nameOrCompany}\nEmail: ${email}\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Advertisement inquiry sent successfully.' });
  } catch (error) {
    console.error('Error sending advertisement form email:', error);
    res.status(500).json({ message: 'Failed to send inquiry. Please try again later.' });
  }
};

module.exports = {
    handleContactForm,
    handleAdvertisementForm
}