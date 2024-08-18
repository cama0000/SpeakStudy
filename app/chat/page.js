'use client';
// this is absar
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { AppBar, Toolbar, Typography, Container, Box, TextField, IconButton, Paper, List, ListItem, ListItemText, Input, CloudUploadIcon } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const searchParams = useSearchParams();
  const filePath = searchParams.get('filePath'); // Retrieve the file path from the query parameter

  useEffect(() => {
    // Initialize media recorder
    if (isRecording && !mediaRecorder) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = event => {
            setAudioChunks(prev => [...prev, event.data]);
          };
          recorder.start();
          setMediaRecorder(recorder);
        })
        .catch(error => console.error('Error accessing the microphone:', error));
    }

    if (!isRecording && mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording, mediaRecorder]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);

    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      setAudioChunks([]);

      const formData = new FormData();
      formData.append('audioFile', audioBlob, 'audio.mp3');

      try {
        const response = await fetch('http://localhost:4000/speech-to-text', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        const transcription = data.transcription || 'No transcription available.';

        setMessages((prevMessages) => [...prevMessages, { text: transcription, sender: 'user' }]);
      } catch (error) {
        console.error('Error sending audio to server:', error);
        setMessages((prevMessages) => [...prevMessages, { text: 'Error processing speech to text.', sender: 'bot' }]);
      }
    }
  };

  return (
    <div>
      {/* Navbar at the top */}
      <AppBar position="static" color="primary">
      </AppBar>

      {/* Chat history in the middle */}
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

      {/* Microphone button at the bottom */}
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

export default ChatbotPage;