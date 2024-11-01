const express = require('express');
//const path = require('path');
//const cookieParser = require('cookie-parser');
//const admin = require('firebase-admin');
//const firebase = require('./config/firebase')
//const swaggerUi = require('swagger-ui-express');
//const docs = require('./docs/index'); 

require('dotenv').config();
const cors = require('cors');


/*admin.initializeApp({
    credential: admin.credential.cert(firebase),
  });*/

const app = express();
const PORT = 3000;

//for Swagger API http://localhost:3000/api-docs/#/

const { dbConnection} = require('./config/database.js');

//routes required
//const memesRoutes = require('./routes/memesRoutes.js')
const imageRoutes = require('./routes/imageRoutes');
const filmRoutes = require('./routes/filmRoutes.js')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));

app.use('/', imageRoutes, filmRoutes);

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(docs));

dbConnection();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

module.exports = app;