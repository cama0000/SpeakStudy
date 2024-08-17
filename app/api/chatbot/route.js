// export async function POST(req) {
//   const { filePath, question } = await req.json();

//   try {
//     // Step 1: Request the Flask server to create the index
//     const indexResponse = await fetch('http://127.0.0.1:5000/index', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ filePath }),
//     });

//     if (!indexResponse.ok) {
//       throw new Error('Failed to create index');
//     }

//     const indexData = await indexResponse.json();

//     // Step 2: Request the Flask server to generate a response based on the index and question
//     const response = await fetch('http://127.0.0.1:5000/respond', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ index: indexData.index, question }),
//     });

//     if (!response.ok) {
//       throw new Error('Failed to generate response');
//     }

//     const data = await response.json();

//     // Step 3: Return the response to the frontend
//     return new Response(JSON.stringify({ reply: data.response }), { status: 200 });
//   } catch (error) {
//     console.error('Error processing the RAG response:', error);
//     return new Response(JSON.stringify({ error: 'Failed to process the request.' }), { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req) {
  // set up gemini and get user message
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const data = await req.json();
    const userMessage = data.message;
    const context = data.context; // ???? pass in text of pdf as well

    const systemPrompt = `You are an educational assistant. Users will pass in their lectures and they will ask questions about it.
    You must provide a response to the user's question based on the lecture content.  

    CONTEXT: ${context}

    USER: ${userMessage}`;

    const model = genAI.getGenerativeModel({
        model: "gemini-1.0-pro",
    });

    const chat = model.startChat()
    let result = await model.generateContent(systemPrompt)

    // make sure this returns text idkkk
    return NextResponse.json({ text: result.response.text() });

    // THIS IS JUST FOR STREAMING RESPONSE
    // const controller = new AbortController();
    // const signal = controller.signal;

    // const stream = new ReadableStream({
    //     async start(controller) {
    //         try {
    //             const result = await model.generateContentStream(conversation, { signal });

    //             const encoder = new TextEncoder();

    //             for await (const chunk of result.stream) {
    //                 const chunkText = chunk.text();
    //                 controller.enqueue(encoder.encode(chunkText));
    //             }

    //             controller.close();
    //         } catch (error) {
    //             console.error('Error generating content:', error);
    //             controller.error(error);
    //         }
    //     },
    // });

    // return new NextResponse(stream);
}