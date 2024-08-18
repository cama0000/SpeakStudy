const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const app = express();
const serveIndex = require('serve-index');
const PORT = process.env.PORT || 4000;
const cors = require('cors');
const bodyParser = require('body-parser');
const pdf = require('pdf-parse');
const fs = require('fs');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.post('/gemini/chat', async (req, res) => {
  try {
    const { filePath, question } = req.body;

    let relativeFilePath = filePath;
    if (filePath.startsWith('uploads')) {
      relativeFilePath = filePath.replace(/^uploads[\\/]/, '');
    }

    // const absoluteFilePath = path.join(__dirname, 'uploads', relativeFilePath);

    console.log("FILE PATH: " + relativeFilePath);



    const dataBuffer = fs.readFileSync(relativeFilePath);

    const pdfData = await pdf(dataBuffer);
    const context = pdfData.text;

    const request = `
      You are a friendly educational assistant. Users will pass in their lectures and they will ask questions about it.
      You must provide a response to the user's question based on the lecture content. Go into a bit of detail.

      CONTEXT: ${context}

      USER: ${question}
    `;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.0-pro",
    });

    const result = await model.generateContent(request);
    const aiReply = result.response.text();

    console.log("RESULT: " + aiReply);

    res.status(200).json({ reply: aiReply });

  } catch (error) {
    console.error('Error processing the file:', error);
    res.status(500).json({ error: 'Error processing the file' });
  }
});

const multer = require('multer');

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
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
    }
});

// Initialize multer with defined storage settings
const upload = multer({ storage: storage});

//Route to handle Speech-to-Text conversion
app.post('/speech-to-text', upload.single('audioFile'), (req, res) => {
  const audioFilePath = req.file.path; //path to the uploaded audio file
  const recognizeParams = {
      audio: fs.createReadStream(audioFilePath), //reads the audio file from the file system
      contentType: 'audio/webm',
  };

  //transcribe the audio -> Watson Speech-to-Text API
  speechToText.recognize(recognizeParams).then(SpeechRecognitionResult => {
      //Extract and join the transcription results into a single string
      //get the transcript from eahc result
      //join all transcripts with a newline
      const transcription = SpeechRecognitionResult.result.results.map(result => result.alternatives[0].transcript).join('\n');

      console.log("INSIDE SERVER")

      res.json({transcription: transcription}); //sends the transcription back as a json file
  }).catch(err => {
      console.error('Error during speech-to-text:', err);
      res.status(500).json({error: 'Failed to convert speech to text'});
  });
});

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