'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Home() {
  const router = useRouter();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if(file){
      if(file.type !== 'application/pdf'){
        alert('Please upload a PDF file.');
        return;
      }

      const formData = new FormData();
      formData.append('lecturePdf', file); // ENSUREEEEEE key matches Express middleware
  
      try {
        const response = await fetch('http://localhost:4000/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          const filePath = data.filePath;

          console.log('File uploaded:', filePath);
  
          router.push(`/chat?filePath=${encodeURIComponent(filePath)}`);
        } else {
          console.error('Upload failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error uploading the file:', error);
      }
    } else {
      console.log('No file uploaded');
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
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            textAlign: 'center',
            backgroundColor: '#f5f5f5',
            borderRadius: 2,
            padding: 4,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Upload Your Notes
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            StudyMate AI has your back for your upcoming exam.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <IconButton color="primary" aria-label="upload file" component="label">
              <Input type="file" onChange={handleFileUpload} sx={{ display: 'none' }} />
              <CloudUploadIcon sx={{ fontSize: 48 }} />
            </IconButton>
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Upload File
              <Input type="file" onChange={handleFileUpload} sx={{ display: 'none' }} />
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}