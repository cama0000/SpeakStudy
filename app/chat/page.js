'use client';
// this is absar
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppBar, Toolbar, Typography, Container, Box, TextField, IconButton, Paper, List, ListItem, ListItemText, Input, CloudUploadIcon } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const searchParams = useSearchParams();
  const filePath = searchParams.get('filePath'); // Retrieve the file path from the query parameter

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        // const response = await fetch('./api/upload', {
        //   method: 'POST',
        //   body: formData,
        // });

        // const data = await response.json();
        // const filePath = data.filePath;

        // Redirect to the chat page, passing the filePath as a query parameter
        // router.push(`/chat?filePath=${encodeURIComponent(filePath)}`);
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    } else {
      console.log('No file uploaded');
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      const userMessage = inputValue;
      setInputValue('');

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ filePath, question: userMessage }),
        });
        const data = await response.json();
        setMessages((prevMessages) => [...prevMessages, { text: data.reply, sender: 'bot' }]);
      } catch (error) {
        console.error('Error communicating with the chatbot:', error);
        setMessages((prevMessages) => [...prevMessages, { text: 'Error communicating with the chatbot.', sender: 'bot' }]);
      }
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <List sx={{ maxHeight: '60vh', overflow: 'auto', mb: 2 }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton color="primary" aria-label="upload file" component="label">
              <Input type="file" onChange={handleFileUpload} sx={{ display: 'none' }} />
              <CloudUploadIcon sx={{ fontSize: 48 }} />
            </IconButton>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Type your question..."
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
            <IconButton color="primary" onClick={handleSendMessage} sx={{ ml: 1 }}>
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default ChatbotPage;