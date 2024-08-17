import multer from 'multer';
import path from 'path';
import { NextResponse } from 'next/server';

// Set up multer to save uploaded files to the /uploads directory
const upload = multer({ dest: path.join(process.cwd(), '/uploads') });

// Middleware to handle the file upload
export async function POST(req) {
  const formData = await new Promise((resolve, reject) => {
    upload.single('file')(req, {}, (err) => {
      if (err) {
        console.error('Upload error:', err);
        return reject(new Error('File upload failed.'));
      }
      resolve(req.file); // req.file contains the uploaded file info
    });
  });

  if (!formData) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Return the path of the uploaded file
  return NextResponse.json({ filePath: formData.path }, { status: 200 });
}

// If you need to disable body parsing, use the new segment config:
// This is the updated configuration syntax to replace `export const config`
export const routeSegmentConfig = {
  api: {
    bodyParser: false, // Disable Next.js default body parser
  },
};