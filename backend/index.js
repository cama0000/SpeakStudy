const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const PORT = process.env.PORT || 4000;
const cors = require('cors');

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
  res.send('StudyTalk Backend is Running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const multer = require('multer');
const path = require('path');

//storage for the file uploads
const storage = multer.diskStorage({

    //specifies where the file will be stored -> /uploads
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // files will be saved in '/uploads'
    },

    //renames the file in a way like '<filname>-<current_timestamp>.pdf'
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with defined storage settings
const upload = multer({ storage: storage});

app.post('/upload', upload.single('lecturePdf'), (req, res) => {

  console.log('Serving /UPLOAD request');

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.send({ filePath: req.file.path });
});

app.use('/uploads', (req, res, next) => {
  console.log('Serving /uploads request');
  next();
}, express.static(path.join(__dirname, 'uploads')), serveIndex(path.join(__dirname, 'uploads'), { icons: true }));
