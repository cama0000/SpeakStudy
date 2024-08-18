'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppBar, Toolbar, Typography, Container, Box, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const ChatbotPageContent = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const searchParams = useSearchParams();
  const filePath = searchParams.get('filePath'); // Retrieve the file path from the query parameter

  useEffect(() => {
    if (isRecording && !mediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          
          // Initialize audioChunks when recording starts
          let localAudioChunks = [];

          recorder.ondataavailable = event => {
            console.log('Data available:', event.data);
            localAudioChunks.push(event.data);
          };

          recorder.onstop = async () => {
            console.log("Recording stopped, processing data...");
            if (localAudioChunks.length > 0) {
              const audioBlob = new Blob(localAudioChunks, { type: 'audio/webm' });

              const formData = new FormData();
              formData.append('audioFile', audioBlob, 'audio.webm');

              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}:4000/speech-to-text`, {
                  method: 'POST',
                  body: formData,
                });
                const data = await response.json();
                const transcription = data.transcription || 'No transcription available.';

                console.log('Transcription:', transcription);

                setMessages((prevMessages) => [...prevMessages, { text: transcription, sender: 'user' }]);



                // call gemini w/ transcription
                try {
                  const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}:4000/gemini/chat`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filePath, question: transcription }),
                  });
                  const data = await response.json();
                  setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
                } catch (error) {
                  console.error('Error communicating with the chatbot:', error);
                  setMessages((prevMessages) => [...prevMessages, { text: 'Error communicating with the chatbot.', sender: 'bot' }]);
                }





              } catch (error) {
                console.error('Error sending audio to server:', error);
                setMessages((prevMessages) => [...prevMessages, { text: 'Error processing speech to text.', sender: 'bot' }]);
              }
            } else {
              console.log("No audio data to process.");
            }
          };

          recorder.start();
          setAudioChunks(localAudioChunks);
          setMediaRecorder(recorder);
        })
        .catch(error => console.error('Error accessing the microphone:', error));
    }

    if (!isRecording && mediaRecorder) {
      console.log("Stopping recording...");
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setMediaRecorder(null);
    }

    return () => {
      if (mediaRecorder) {
        console.log("Cleaning up recorder...");
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording, mediaRecorder]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StudyMate AI
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, height: '60vh', overflowY: 'auto' }}>
          <List>
            {messages.map((message, index) => (
              <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: message.sender === 'user' ? '#1976d2' : '#e0e0e0',
                    color: message.sender === 'user' ? '#fff' : '#000',
                    maxWidth: '70%',
                  }}
                >
                  <ListItemText primary={message.text} />
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>

      <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <IconButton
          color={isRecording ? "secondary" : "primary"}
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          sx={{ width: 80, height: 80, backgroundColor: isRecording ? '#f44336' : '#1976d2', color: '#fff', borderRadius: '50%' }}
        >
          {isRecording ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
        </IconButton>
      </Box>
    </div>
  );
};

const ChatbotPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ChatbotPageContent />
  </Suspense>
);

export default ChatbotPage;



// 'use client';

// //Chatbot page

// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { AppBar, Toolbar, Typography, Container, Box, Paper, List, ListItem, ListItemText, IconButton } from '@mui/material';
// import MicIcon from '@mui/icons-material/Mic';
// import StopIcon from '@mui/icons-material/Stop';

// const ChatbotPage = () => {
//   const [messages, setMessages] = useState([]);
//   const [isRecording, setIsRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const [audioChunks, setAudioChunks] = useState([]);
//   const searchParams = useSearchParams();
//   const filePath = searchParams.get('filePath'); // Retrieve the file path from the query parameter

//   useEffect(() => {
//     if (isRecording && !mediaRecorder) {
//       navigator.mediaDevices.getUserMedia({ audio: true })
//         .then(stream => {
//           const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          
//           // Initialize audioChunks when recording starts
//           let localAudioChunks = [];

//           recorder.ondataavailable = event => {
//             console.log('Data available:', event.data);
//             localAudioChunks.push(event.data);
//           };

//           recorder.onstop = async () => {
//             console.log("Recording stopped, processing data...");
//             if (localAudioChunks.length > 0) {
//               const audioBlob = new Blob(localAudioChunks, { type: 'audio/webm' });

//               const formData = new FormData();
//               formData.append('audioFile', audioBlob, 'audio.webm');

//               try {
//                 const response = await fetch('http://localhost:4000/speech-to-text', {
//                   method: 'POST',
//                   body: formData,
//                 });
//                 const data = await response.json();
//                 const transcription = data.transcription || 'No transcription available.';

//                 console.log('Transcription:', transcription);

//                 setMessages((prevMessages) => [...prevMessages, { text: transcription, sender: 'user' }]);



//                 // call gemini w/ transcription
//                 try {
//                   const response = await fetch('http://localhost:4000/gemini/chat', {
//                     method: 'POST',
//                     headers: {
//                       'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ filePath, question: transcription }),
//                   });
//                   const data = await response.json();
//                   setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
//                 } catch (error) {
//                   console.error('Error communicating with the chatbot:', error);
//                   setMessages((prevMessages) => [...prevMessages, { text: 'Error communicating with the chatbot.', sender: 'bot' }]);
//                 }





//               } catch (error) {
//                 console.error('Error sending audio to server:', error);
//                 setMessages((prevMessages) => [...prevMessages, { text: 'Error processing speech to text.', sender: 'bot' }]);
//               }
//             } else {
//               console.log("No audio data to process.");
//             }
//           };

//           recorder.start();
//           setAudioChunks(localAudioChunks);
//           setMediaRecorder(recorder);
//         })
//         .catch(error => console.error('Error accessing the microphone:', error));
//     }

//     if (!isRecording && mediaRecorder) {
//       console.log("Stopping recording...");
//       mediaRecorder.stop();
//       mediaRecorder.stream.getTracks().forEach(track => track.stop());
//       setMediaRecorder(null);
//     }

//     return () => {
//       if (mediaRecorder) {
//         console.log("Cleaning up recorder...");
//         mediaRecorder.stop();
//         mediaRecorder.stream.getTracks().forEach(track => track.stop());
//       }
//     };
//   }, [isRecording, mediaRecorder]);

//   const handleStartRecording = () => {
//     setIsRecording(true);
//   };

//   const handleStopRecording = () => {
//     setIsRecording(false);
//   };

//   return (
//     <div>
//       <AppBar position="static" color="primary">
//         <Toolbar>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
//             StudyMate AI
//           </Typography>
//         </Toolbar>
//       </AppBar>

//       <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
//         <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, height: '60vh', overflowY: 'auto' }}>
//           <List>
//             {messages.map((message, index) => (
//               <ListItem key={index} sx={{ justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start' }}>
//                 <Box
//                   sx={{
//                     p: 2,
//                     borderRadius: 2,
//                     backgroundColor: message.sender === 'user' ? '#1976d2' : '#e0e0e0',
//                     color: message.sender === 'user' ? '#fff' : '#000',
//                     maxWidth: '70%',
//                   }}
//                 >
//                   <ListItemText primary={message.text} />
//                 </Box>
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//       </Container>

//       <Box sx={{ position: 'fixed', bottom: 20, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
//         <IconButton
//           color={isRecording ? "secondary" : "primary"}
//           onClick={isRecording ? handleStopRecording : handleStartRecording}
//           sx={{ width: 80, height: 80, backgroundColor: isRecording ? '#f44336' : '#1976d2', color: '#fff', borderRadius: '50%' }}
//         >
//           {isRecording ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
//         </IconButton>
//       </Box>
//     </div>
//   );
// };

// export default ChatbotPage;