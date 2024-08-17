const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;


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
        cb(null, file.fieldname + '-' + Date.now() + path.extreme(file.originalname));
    }
});

// Initialize multer with defined storage settings
const upload = multer({ storage: storage});

//route to handle pdf uploads
app.post('/upload', upload.single('lecturePdf'), (req, res) => {

    res.send(`File uploaded: ${req.file.path}`);
})
