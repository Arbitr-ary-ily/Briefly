import { NextResponse } from 'next/server';
import axios from 'axios';

// List of API keys
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

// Fetch top headlines with a specific API key
async function fetchTopHeadlinesWithKey(apiKey, category = 'general', page = 1, pageSize = 10) {
  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey,
        country: 'us',
        category,
        page,
        pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed with API key: ${apiKey} - ${error.message}`);
  }
}

// Rotate through API keys to fetch news
async function fetchTopHeadlinesWithRotatingKeys(category = 'general', page = 1, pageSize = 10) {
  for (const apiKey of newsApiKeys) {
    try {
      const data = await fetchTopHeadlinesWithKey(apiKey, category, page, pageSize);
      if (data.articles && data.articles.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn(error.message);
      continue;
    }
  }
  throw new Error('All API keys failed.');
}

// Main GET handler
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

  try {
    const data = await fetchTopHeadlinesWithRotatingKeys(category, page, pageSize);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching top headlines:', error);
    return NextResponse.json({ error: 'Failed to fetch top headlines' }, { status: 500 });
  }
}


