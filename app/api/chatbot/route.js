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




// import { GoogleGenerativeAI } from "@google/generative-ai";

// export async function POST(req) {
//     const { filePath, question } = await req.json();
//     console.log("filePath and question: " + filePath + " " + question);
//     const apiKey = process.env.GEMINI_API_KEY;
//     const genAI = new GoogleGenerativeAI(apiKey);

//     // const systemPrompt = `You are an educational assistant. Users will pass in their lectures and they will ask questions about it.
//     // You must provide a response to the user's question based on the lecture content.  

//     // CONTEXT: ${context}

//     // USER: ${userMessage}`;

//     const model = genAI.getGenerativeModel({
//         model: "gemini-1.0-pro",
//     });

//     const chat = model.startChat()
//     let result = await model.generateContent(question)

//     return new Response(JSON.stringify({ reply: result.response.text() }), { status: 200 });
// }