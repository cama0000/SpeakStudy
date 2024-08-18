const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const axios = require('axios');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); //File System module for interacting with uploaded files

 //Speech-to-Text service
const { error } = require('console');

app.use(express.json()); //allows the app to parse incoming json requests

require('dotenv').config({ path: '../.env.local' });



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
        cb(null, path.join(__dirname, '../uploads/')); // files will be saved in '/uploads'
    },


    //renames the file in a way like '<filname>-<current_timestamp>.pdf'
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extreme(file.originalname));
    }
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

// Initialize multer with defined storage settings
const upload = multer({ storage: storage});

//route to handle pdf uploads
app.post('/upload', upload.single('lecturePdf'), (req, res) => {

    res.send(`File uploaded: ${req.file.path}`); //responds with the path of the uploaded file
});




app.post('/text-to-speech',async (req,res)=>{
    const{text} = req.body;

    const headers = {
        'Authorization' :  `Bearer ${process.env.UNREAL_API_KEY}`,
        'Content-Type': 'application/json',
    };
    const data = {
        'Text': text,
        'VoiceId': 'Amy',
        'Bitrate': '192k',
        'Speed': '0',
        'Pitch': '1',
        'TimestampType': 'sentence',
    };

    try {
        // Creating synthesis task for upto 500 characters
        const creationResponse = await axios.post('https://api.v7.unrealspeech.com/synthesisTasks', data, { headers });

        if (creationResponse.status !== 200) {
            throw new Error('Failed to create task');
        }

        // the taskID
        const taskId = creationResponse.data.SynthesisTask.TaskId;

        // Check the status of the task
        const statusResponse = await axios.get(`https://api.v7.unrealspeech.com/synthesisTasks/${taskId}`, { headers });

        if (statusResponse.status !== 200) {
            throw new Error('Failed to retrieve task status');
        }
    res.send(`File uploaded: ${req.file.path}`);
})

        const responseData = statusResponse.data;

        // Respond with the task status and URLs if available
        res.json({
            taskId: responseData.SynthesisTask.TaskId,
            taskStatus: responseData.SynthesisTask.TaskStatus,
            outputUri: responseData.SynthesisTask.OutputUri,
            timestampsUri: responseData.SynthesisTask.TimestampsUri,
        });
    } catch (error) {
        console.error('Error during synthesis task:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});