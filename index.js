const express = require('express');
const { approveOldContent, updateOldContent } = require('./controllers/oldContentChanges.js');
const path = require('path');
const admin = require('firebase-admin'); 

require('dotenv').config();
const cors = require('cors');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const app = express();
const PORT = 3000;


const { dbConnection} = require('./config/database.js');


const imageRoutes = require('./routes/imageRoutes');
const filmRoutes = require('./routes/filmRoutes.js');
const memeRoutes = require('./routes/memeRoutes.js');
const quizRoutes = require('./routes/quizRoutes.js');
const commentRoutes = require('./routes/commentRoutes');
const footerRoutes = require('./routes/footerRoutes');
const mainRoutes = require('./routes/mainRoutes'); 
const authRoutes = require('./routes/auth.js');
const profileRoutes = require('./routes/profileRoutes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', mainRoutes);
app.use('/', filmRoutes); 
app.use('/', imageRoutes); 
app.use('/', memeRoutes);
app.use('/', quizRoutes);
app.use('/', commentRoutes);
app.use('/', footerRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

approveOldContent();
updateOldContent();


dbConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;