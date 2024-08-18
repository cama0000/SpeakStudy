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
    <div style={{
      backgroundImage: "url('/ai.png')",
      height: "100vh",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      margin: "0px",
      padding: "0px"
    }}>
      <Box style={{ float: 'right' }}>
      <Button
  color='warning'
  size='large'
  style={{ fontSize: '1.5rem', padding: '16px 32px' }} 
>
  Register
  </Button>
  <Button
  color='warning'
  size='large'
  style={{ fontSize: '1.5rem', padding: '16px 32px' }} 
>
  Login
  </Button>
      </Box>
      <h1 style={{ color: 'white', position: 'absolute', bottom: '370px', left: '200px', fontSize: '5rem' }}>
    SpeakStudy
  </h1>
    </div>
  );
}