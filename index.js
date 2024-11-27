const express = require('express');
const { approveOldContent } = require('./controllers/oldContentChanges.js');
const path = require('path');
//const cookieParser = require('cookie-parser');
const admin = require('firebase-admin');
//const firebase = require('./config/firebase')
//const swaggerUi = require('swagger-ui-express');
//const docs = require('./docs/index'); 

require('dotenv').config();
const cors = require('cors');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

const app = express();
const PORT = 3000;

//for Swagger API http://localhost:3000/api-docs/#/

const { dbConnection} = require('./config/database.js');

//routes required

const imageRoutes = require('./routes/imageRoutes');
const filmRoutes = require('./routes/filmRoutes.js');
const memeRoutes = require('./routes/memeRoutes.js');
const quizRoutes = require('./routes/quizRoutes.js');
const commentRoutes = require('./routes/commentRoutes');
const footerRoutes = require('./routes/footerRoutes');
const mainRoutes = require('./routes/mainRoutes'); 
const authRoutes = require('./routes/auth.js');
const profileRoutes = require('./routes/profileRoutes.js');
const postRoutes = require('./routes/postsRoutes.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
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
app.use('/posts', postRoutes);
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

approveOldContent();

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

dbConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;