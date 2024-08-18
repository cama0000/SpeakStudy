// import { GoogleGenerativeAI } from "@google/generative-ai";
// import fetch from 'node-fetch';  // Use 'node-fetch' to handle file fetching
// import pdf from 'pdf-parse';  // Use 'pdf-parse' for extracting text from PDF

// export async function POST(req) {
//     const { filePath, question } = await req.json();
//     const apiKey = process.env.GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(apiKey);

//     const model = genAI.getGenerativeModel({
//         model: "gemini-1.0-pro",
//     });

//     const formattedFilePath = filePath.replace(/\\/g, '/');
//     const finalFilePath = `http://localhost:4000/` + `${formattedFilePath}`;

//     console.log("FILEPATH: " + finalFilePath);

//     const response = await fetch(finalFilePath);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch PDF: ${response.statusText}`);
//         }

//         // Convert the PDF to a buffer
//         const buffer = await response.buffer();

//         // Extract text from the PDF buffer
//         const data = await pdf(buffer);
//         const context = data.text;

//     const textPart = {
//         text: `
//         You are an educational assistant. Users will pass in their lectures and they will ask questions about it.
//      You must provide a response to the user's question based on the lecture content.

//      CONTEXT: ${context}
     
//      USER: ${question}`,
//       };
    
//       const request = {
//         contents: [{role: 'user', parts: [filePart, textPart]}],
//       };
    
//     const result = await model.generateContent(request);

//     console.log("RESULT: " + result.response.text());

//     return new Response(JSON.stringify({ reply: result.response.text() }), { status: 200 });

//     // return new Response(JSON.stringify({ reply: "Hello" }), { status: 200 });
// }




import { GoogleGenerativeAI } from "@google/generative-ai";
// import fetch from 'node-fetch';
import pdf from "pdf-parse-debugging-disabled";
import fs from 'fs';

export async function POST(req) {
    const { filePath, question } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    // Format file path for use in URL
    const formattedFilePath = filePath.replace(/\\/g, '/');
    const finalFilePath = `http://localhost:4000/${formattedFilePath}`;

    try {
        // Fetch the PDF file from the server
        // const response = await fetch(finalFilePath);

        let dataBuffer = fs.readFileSync(finalFilePath);
 
        pdf(dataBuffer).then(function(data) {
            console.log(data.text); 
        });

        return new Response(JSON.stringify({ reply: "Hello" }), { status: 200 });

        // if (!response.ok) {
        //     throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        // }

        // // Convert the PDF to a buffer
        // const buffer = await response.buffer();

        // Extract text from the PDF buffer
        const data = await pdf(buffer);
        const context = data.text;



        // Construct text part for request
        const textPart = {
            text: `
            You are an educational assistant. Users will pass in their lectures and they will ask questions about it.
         You must provide a response to the user's question based on the lecture content.

         CONTEXT: ${context}
         
         USER: ${question}`,
        };

        const model = genAI.getGenerativeModel({
            model: "gemini-1.0-pro",
        });

        const request = {
            contents: [{role: 'user', parts: [textPart]}],
        };

        const result = await model.generateContent(request);
        const aiReply = result.response.text();

        console.log("RESULT: " + aiReply);

        return new Response(JSON.stringify({ reply: aiReply }), { status: 200 });

    } catch (error) {
        console.error('Error processing the file:', error);
        return new Response(JSON.stringify({ error: 'Error processing the file' }), { status: 500 });
    }
}