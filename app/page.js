'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, Typography, Container, Box, Button, IconButton, Input } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function Home() {
  return (
    <div style={{
      backgroundImage: "url('/ai.png')",
      height: "100vh",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      margin: "0px",
      padding: "0px"
    }}>
      <Box>
        <Button
          color='warning'
          size='large'
          style={{ fontSize: '1.5rem', padding: '16px 32px', position: 'absolute', bottom: '300px', left: '300px', border: '2px solid white' }}
          href='/newpage'
        >
          ChatBot
        </Button>
      </Box>
      <h1 style={{ color: 'white', position: 'absolute', bottom: '370px', left: '200px', fontSize: '5rem' }}>
        SpeakStudy
      </h1>
    </div>
  )
}
