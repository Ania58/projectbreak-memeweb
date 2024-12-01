# ProjectBreak MemeWeb - Backend

Este backend está desarrollado con **Node.js** y sirve como núcleo para un sitio web que permite tanto a administradores como a usuarios crear y gestionar contenido como imágenes, películas, memes y cuestionarios. El backend maneja el almacenamiento de contenido, la autenticación de usuarios y las operaciones CRUD utilizando **MongoDB**.

---

## Requisitos previos

Antes de configurar el backend, asegúrate de tener instalados los siguientes elementos en tu sistema:

- **Node.js**
- **MongoDB**
- **Un gestor de paquetes** (npm o yarn)

---

## Instalación

### Clona el repositorio:

```bash
git clone https://github.com/your-repo/projectbreak-memeweb.git
cd projectbreak-memeweb
```

### Instala las dependencias:

Ejecuta el siguiente comando para instalar todas las dependencias requeridas:

```bash
npm install
```

### Este proyecto utiliza los siguientes paquetes:

- `axios`: Para manejar solicitudes HTTP.
- `cors`: Para habilitar el uso compartido de recursos entre orígenes (CORS).
- `dotenv`: Para gestionar variables de entorno de forma segura.
- `express`: Para construir el servidor y manejar rutas HTTP.
- `firebase`: Para la autenticación en el cliente con Firebase.
- `firebase-admin`: Para la administración del servidor con Firebase.
- `mongoose`: Para interactuar con la base de datos MongoDB.
- `multer`: Para manejar cargas de archivos.
- `nodemailer`: Para enviar correos electrónicos (por ejemplo, verificación de correo).

---

## Crea un archivo `.env`

Añade tus variables de entorno a un archivo `.env`:

```plaintext
MONGO_URI=tu-cadena-de-conexión-a-mongodb
FIREBASE_PROJECT_ID=tu-id-de-proyecto-de-firebase
FIREBASE_PRIVATE_KEY=tu-clave-privada-de-firebase
FIREBASE_CLIENT_EMAIL=tu-correo-del-cliente-de-firebase
```

Asegúrate de incluir `.env`, `node_modules`, y `package-lock.json` en `.gitignore` para mantener segura la información sensible.

---

## Inicia el servidor

Ejecuta el siguiente comando para iniciar el servidor:

```bash
node index.js
```

---

## Estructura del proyecto

Resumen de la estructura de carpetas y archivos:

```plaintext
projectbreak-memeweb/
│
├── config/
│   └── database.js        # Configuración de conexión con MongoDB
├── controllers/
│   ├── filmsController.js
│   ├── imagesController.js
│   ├── memesController.js
│   └── quizzesController.js
├── middlewares/
│   └── upload.js          # Configuración de Multer para cargas de archivos
├── models/
│   ├── Film.js
│   ├── Image.js
│   ├── Meme.js
│   └── Quiz.js
├── routes/
│   ├── filmRoutes.js
│   ├── imageRoutes.js
│   ├── memeRoutes.js
│   ├── quizRoutes.js
│   └── mainRoutes.js      # Rutas generales (por ejemplo, mostrar contenido)
├── .env                   # Variables de entorno
├── index.js               # Punto de entrada del servidor
└── package.json           # Dependencias y scripts
```

---

## Guía paso a paso

### 1. Inicializa el servidor

Importa Express y crea una instancia de la aplicación en `index.js`:

```javascript
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

Inicializa el SDK de Firebase Admin antes de requerir las rutas (cuando ya lo tienes):

```javascript
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // Descárgalo desde Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
```

---

### 2. Configuración de MongoDB

Crea un archivo `config/database.js` para conectar con MongoDB:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully');
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching the database');
  }
};

module.exports = dbConnection;
```

Requiere e invoca esta conexión en `index.js`:

```javascript
const dbConnection = require('./config/database');
dbConnection();
```

---

### 3. Modelos

Crea modelos separados para imágenes, películas, memes y cuestionarios en la carpeta `models/`:

**Ejemplo: `Film.js`**

```javascript
const mongoose = require('mongoose');

const FilmSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // Recomiendo usar enums
    tags: [String],
    videoUrl: { type: String, required: true },
    agreements: { type: Boolean, required: true },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    approved: { type: Boolean, default: false },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Film', FilmSchema);
```

---

### 4. Rutas y controladores

Crea controladores separados para cada tipo de contenido (por ejemplo, `filmController.js`) e implementa la lógica CRUD:

**Ejemplo: Añadir película en `filmsController.js`**

```javascript
const Film = require('../models/Film');

const addFilm = async (req, res) => {
  const { title, category, filmCategory, description, tags, agreements, isApproved } = req.body;
  const videoUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const newFilm = await Film.create({
      title,
      category,
      filmCategory,
      videoUrl,
      description,
      tags: tags.split(',').map((tag) => tag.trim()),
      agreements: {
        rulesAccepted: req.body['agreements.rulesAccepted'] === 'true',
        copyrightsAccepted: req.body['agreements.copyrightsAccepted'] === 'true',
      },
      isApproved: isApproved !== undefined ? isApproved : false,
      userId: req.user.uid,
    });
    res.status(201).json(newFilm);
  } catch (error) {
    console.error('Error adding film:', error);
    res.status(500).json({ message: 'Failed to add film' });
  }
};

module.exports = { addFilm };
```

Registra las rutas en `routes/filmRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const { addFilm } = require('../controllers/filmController');
const upload = require('../middlewares/upload');

router.post('/films', upload.single('file'), addFilm);

module.exports = router;
```

Importa y usa las rutas en `index.js`:

```javascript
const filmRoutes = require('./routes/filmRoutes');
app.use('/', filmRoutes);
```

---

### 5. Middleware para cargas de archivos

Usa Multer para manejar las cargas de archivos. Crea `middlewares/upload.js`:

```javascript
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
```

---

### 6. Características adicionales

Implementa middlewares de Firebase para autenticación (por ejemplo, verificar tokens de usuario) y protección de rutas para editar/eliminar contenido.

---

## Prueba del backend

Usa Postman para probar las rutas.

**Ejemplo: Añadir contenido con POST:**

- **URL:** `http://localhost:3000/films`
- **Método:** `POST`
- **Cuerpo:** Form-data (incluye archivo y metadatos).

---

## Próximos pasos

- Ajusta la lógica del backend según sea necesario al desarrollar el frontend.
- Expande la funcionalidad con características adicionales como comentarios, contenido destacado o acciones exclusivas para administradores.

---

¡Disfruta construyendo tu proyecto!