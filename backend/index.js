const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;


const multer = require('multer');
const path = require('path'); 
const fs = require('fs'); //File System module for interacting with uploaded files

const { IamAuthenticator } = require('ibm-watson/auth');
const SpeechToTextV1 = require('ibm-watson/speech-to-text/v1'); //Speech-to-Text service
const { error } = require('console');

app.use(express.json()); //allows the app to parse incoming json requests

require('dotenv').config({ path: '../.env.local' });

//Watson Speech-to-Text client -> Loads API KEY and url
const speechToText = new SpeechToTextV1({
    authenticator: new IamAuthenticator({
        apikey: process.env.S2T_API_KEY,
    }),
    serviceUrl: process.env.S2T_URL,
})

app.get('/', (req, res) => {
  res.send('StudyTalk Backend is Running!');
});

//storage for the file uploads
const storage = multer.diskStorage({

    //specifies where the file will be stored -> /uploads
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/')); // files will be saved in '/uploads'
    },

    
    //renames the file in a way like '<filname>-<current_timestamp>.pdf'
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize multer with defined storage settings
const upload = multer({ storage: storage});

//route to handle pdf uploads
app.post('/upload', upload.single('lecturePdf'), (req, res) => {

    res.send(`File uploaded: ${req.file.path}`); //responds with the path of the uploaded file
});


//Route to handle Speech-to-Text conversion
app.post('/speech-to-text', upload.single('audioFile'), (req, res) => {
    const audioFilePath = req.file.path; //path to the uploaded audio file

    const recognizeParams = {
        audio: fs.createReadStream(audioFilePath), //reads the audio file from the file system
        contentType: 'audio/mp3',
    };

    //transcribe the audio -> Watson Speech-to-Text API
    speechToText.recognize(recognizeParams).then(SpeechRecognitionResult => {
        //Extract and join the transcription results into a single string
        //get the transcript from eahc result
        //join all transcripts with a newline
        const transcription = SpeechRecognitionResult.result.results.map(result => result.alternatives[0].transcript).join('\n');

        res.json({transcription: transcription}); //sends the transcription back as a json file
    }).catch(err => {
        console.error('Error during speech-to-text:', err);
        res.status(500).json({error: 'Failed to convert speech to text'});
    });

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});