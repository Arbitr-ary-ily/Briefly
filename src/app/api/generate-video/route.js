import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export async function POST(req) {
  if (req.method !== 'POST') {
    return new Response(null, { status: 405 });
  }

  const { imagePath, seed = 0, cfg_scale = 1.8, motion_bucket_id = 127 } = await req.json();

  try {
    // Create a FormData instance
    const formData = new FormData();
    
    // Append the image file
    formData.append('image', fs.createReadStream(imagePath)); // Ensure imagePath is a valid path to the image file

    // Append optional parameters
    formData.append('seed', seed);
    formData.append('cfg_scale', cfg_scale);
    formData.append('motion_bucket_id', motion_bucket_id);

    // Make the request to the Stability AI API
    const response = await axios.post(
      'https://api.stability.ai/v2beta/image-to-video',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          ...formData.getHeaders() // Automatically set the correct Content-Type
        }
      }
    );

    const generationId = response.data.id;
    return new Response(JSON.stringify({ generationId }), { status: 200 });
  } catch (error) {
    console.error('Error generating video:', error.response ? error.response.data : error.message);
    return new Response(JSON.stringify({ error: 'Error generating video', details: error.response ? error.response.data : error.message }), { status: 500 });
  }
}

// ... other HTTP methods can be added here if needed
