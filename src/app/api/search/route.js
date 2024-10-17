import { NextResponse } from 'next/server';
import axios from 'axios';

const newsApiKeys = [
  process.env.NEWS_API_KEY_ONE,
  process.env.NEWS_API_KEY_TWO,
  process.env.NEWS_API_KEY_THREE,
  process.env.NEWS_API_KEY_FOUR,
  process.env.NEWS_API_KEY_FIVE,
  process.env.NEWS_API_KEY_SIX,
  process.env.NEWS_API_KEY_SEVEN,
  process.env.NEWS_API_KEY_EIGHT,
  process.env.NEWS_API_KEY_NINE,
  process.env.NEWS_API_KEY_TEN,
  process.env.NEWS_API_KEY_ELEVEN,
  process.env.NEWS_API_KEY_TWELVE,
  process.env.NEWS_API_KEY_THIRTEEN,
  process.env.NEWS_API_KEY_FOURTEEN,
];

// Fetch news with a specific API key
async function fetchNewsWithKey(apiKey, query = '', page = 1, pageSize = 9) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${apiKey}`;
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    throw new Error(`Failed with API key: ${apiKey}`);
  }
}

// Fetch news with rotating API keys
async function fetchNewsWithRotatingKeys(query = '', page = 1, pageSize = 9) {
  for (const apiKey of newsApiKeys) {
    try {
      const data = await fetchNewsWithKey(apiKey, query, page, pageSize);
      if (data.articles && data.articles.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn(error.message);
      continue; // Move on to the next key if there's an error
    }
  }
  throw new Error('All API keys failed.');
}

// Main GET handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q'); // Search query
  const page = parseInt(searchParams.get('page') || '1', 10); // Page number
  const limit = parseInt(searchParams.get('limit') || '9', 10); // Items per page

  if (!q) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const data = await fetchNewsWithRotatingKeys(q, page, limit);
    // Return the data directly without formatting
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json({ error: 'Failed to search articles', details: error.message }, { status: 500 });
  }
}
