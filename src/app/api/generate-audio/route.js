import axios from 'axios';

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const { script } = await req.json();

  try {
    const response = await axios.post(
      'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM',
      {
        text: script,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      },
      {
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBuffer = Buffer.from(response.data);
    const audioUrl = `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`;

    return new Response(JSON.stringify({ audioUrl }), { status: 200 });
  } catch (error) {
    console.error('Error generating audio:', error);
    return new Response(JSON.stringify({ error: 'Error generating audio' }), { status: 500 });
  }
}

// ... other HTTP methods can be added here if needed
