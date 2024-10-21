// import axios from 'axios';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import ffmpeg from 'fluent-ffmpeg';
// import path from 'path';
// import fs from 'fs/promises';

// const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_TWO);
// const tempDir = path.join(process.cwd(), 'temp');

// export async function POST(req) {
//   if (req.method !== 'POST') {
//     return new Response(null, { status: 405 });
//   }

//   const { article } = await req.json();

//   try {
//     // Step 1: Generate the script
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const prompt = `Create a short video script based on the following article:
//     Title: ${article.title}
//     Description: ${article.description}
    
//     The script should be concise, engaging, and suitable for a 1-2 minute video.`;

//     const result = await model.generateContent(prompt);
//     const script = result.response.text();

//     // Step 2: Generate audio narration (using a text-to-speech API)
//     /*
//     const audioResponse = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
//       text: script,
//       voice_settings: { stability: 0.5, similarity_boost: 0.5 }
//     }, {
//       headers: {
//         'Accept': 'audio/mpeg',
//         'xi-api-key': process.env.ELEVENLABS_API_KEY,
//         'Content-Type': 'application/json'
//       },
//       responseType: 'arraybuffer'
//     });

//     const audioBuffer = Buffer.from(audioResponse.data);
//     const audioPath = path.join(tempDir, 'narration.mp3');
//     await fs.writeFile(audioPath, audioBuffer);
//     */

//     // Step 3: Generate images for the video using Hugging Face's Stable Diffusion
//     const keywordsResult = await model.generateContent(`Extract 5 key visual concepts from this script as single words or short phrases: ${script}`);
//     const keywords = keywordsResult.response.text().split('\n').map(k => k.trim());

//     const images = [];
//     for (const keyword of keywords) {
//       try {
//         const response = await axios.post(
//           'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1',
//           { inputs: keyword },
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
//               'Content-Type': 'application/json'
//             },
//             responseType: 'arraybuffer'
//           }
//         );

//         const imageBuffer = Buffer.from(response.data);
//         const imagePath = path.join(tempDir, `${keyword.replace(/\s+/g, '_')}.png`);
//         await fs.writeFile(imagePath, imageBuffer);
//         images.push(imagePath);
//       } catch (error) {
//         console.error('Error generating image:', error);
//         return new Response(JSON.stringify({ error: 'Error generating image', details: error.message }), { status: 500 });
//       }
//     }

//     // Step 4: Create video using fluent-ffmpeg
//     const outputPath = path.join(tempDir, 'output.mp4');

//     // Create a video with images and audio
//     ffmpeg()
//       // .input(audioPath) // Commented out audio input
//       .inputOptions('-stream_loop', '-1') // Loop the audio
//       .input(images[0]) // Start with the first image
//       .loop(5) // Loop the first image for 5 seconds
//       .outputOptions('-c:v', 'libx264')
//       .outputOptions('-c:a', 'aac')
//       .outputOptions('-shortest') // Stop when the shortest input ends
//       .save(outputPath)
//       .on('end', async () => {
//         const data = await fs.readFile(outputPath);
//         // await fs.unlink(audioPath); // Clean up audio file (commented out)
//         await fs.unlink(outputPath); // Clean up video file
//         return new Response(data, { 
//           status: 200, 
//           headers: { 'Content-Type': 'video/mp4' } 
//         });
//       })
//       .on('error', (err) => {
//         console.error('Error generating video:', err);
//         return new Response(JSON.stringify({ error: 'Error generating video', details: err.message }), { 
//           status: 500,
//           headers: { 'Content-Type': 'application/json' }
//         });
//       });

//   } catch (error) {
//     console.error('Error generating video:', error);
//     return new Response(JSON.stringify({ error: 'Error generating video', details: error.message }), { 
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     });
//   }
// }

import { GoogleGenerativeAI } from '@google/generative-ai';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import axios from 'axios';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY_TWO);
const tempDir = path.join(process.cwd(), 'temp');

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const { article } = await req.json();

  try {
    // Step 1: Generate the script
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Create a short video script based on the following article:
    Title: ${article.title}
    Description: ${article.description}
    
    The script should be concise, engaging, and suitable for a 1-2 minute video.`;

    const result = await model.generateContent(prompt);
    const script = result.response.text();

    // Step 2: Generate audio narration using Web Speech API
    const audioBuffer = await generateSpeech(script);
    const audioPath = path.join(tempDir, 'narration.mp3');
    await fs.writeFile(audioPath, audioBuffer);

    // Step 3: Generate images using Unsplash API
    const keywordsResult = await model.generateContent(`Extract 5 key visual concepts from this script as single words or short phrases: ${script}`);
    const keywords = keywordsResult.response.text().split('\n').map(k => k.trim());

    const images = [];
    for (const keyword of keywords) {
      try {
        const response = await axios.get(`https://source.unsplash.com/featured/?${encodeURIComponent(keyword)}`, {
          responseType: 'arraybuffer'
        });

        const imageBuffer = Buffer.from(response.data);
        const imagePath = path.join(tempDir, `${keyword.replace(/\s+/g, '_')}.jpg`);
        await fs.writeFile(imagePath, imageBuffer);
        images.push(imagePath);
      } catch (error) {
        console.error('Error generating image:', error);
        return new Response(JSON.stringify({ error: 'Error generating image', details: error.message }), { status: 500 });
      }
    }

    // Step 4: Create video using fluent-ffmpeg
    const outputPath = path.join(tempDir, 'output.mp4');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(audioPath)
        .input('concat:' + images.join('|'))
        .inputOptions('-loop 1')
        .outputOptions('-c:v', 'libx264')
        .outputOptions('-c:a', 'aac')
        .outputOptions('-pix_fmt', 'yuv420p')
        .outputOptions('-shortest')
        .outputOptions('-vf', 'scale=1280:720')
        .save(outputPath)
        .on('end', async () => {
          const data = await fs.readFile(outputPath);
          await fs.unlink(audioPath);
          await fs.unlink(outputPath);
          for (const image of images) {
            await fs.unlink(image);
          }
          resolve(new Response(data, { 
            status: 200, 
            headers: { 'Content-Type': 'video/mp4' } 
          }));
        })
        .on('error', (err) => {
          console.error('Error generating video:', err);
          reject(new Response(JSON.stringify({ error: 'Error generating video', details: err.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }));
        });
    });

  } catch (error) {
    console.error('Error generating video:', error);
    return new Response(JSON.stringify({ error: 'Error generating video', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function generateSpeech(text) {
  const { exec } = require('child_process');
  const audioPath = path.join(tempDir, 'narration.mp3');

  return new Promise((resolve, reject) => {
    // Use a command-line tool like 'gtts' (Google Text-to-Speech) or similar
    exec(`gtts-cli "${text}" --output "${audioPath}"`, async (error) => { // Mark the callback as async
      if (error) {
        return reject(error);
      }
      const audioBuffer = await fs.readFile(audioPath); // Read the generated audio file
      resolve(audioBuffer);
    });
  });
}
