import React from 'react';
import { Input, Button } from '@nextui-org/react';

export default function NewPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '3s0vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Input
          type="text"
          placeholder="Text"
          style={{
            width: '1300px', 
            height: '60px',
            fontSize: '1.25rem',
            paddingLeft: '15px',
            border: '2px solid #001',
            borderRadius: '25px',
            paddingRight: '10px',
          }}
        />
        <Button
          color='warning'
          size='large'
          style={{
            fontSize: '1.25rem',
            padding: '12px 24px',
            border: '2px solid #001',
            borderRadius: '25px',
            height: '60px',
          }}
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
