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

const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Function to fetch news with a specific API key
async function fetchEverythingWithKey(apiKey, q, page, pageSize, sortBy) {
  try {
    const response = await axios.get(`${NEWS_API_BASE_URL}/everything`, {
      params: {
        apiKey,
        q,
        page,
        pageSize,
        sortBy,
        language: 'en', // You can make this dynamic if needed
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`API key ${apiKey} failed: ${error.message}`);
  }
}

// Function to rotate through API keys
async function fetchEverythingWithRotatingKeys(q, page, pageSize, sortBy) {
  for (const apiKey of newsApiKeys) {
    try {
      const data = await fetchEverythingWithKey(apiKey, q, page, pageSize, sortBy);
      if (data.articles && data.articles.length > 0) {
        return data;
      }
    } catch (error) {
      console.warn(error.message);
      continue; // Try the next key if there's an error
    }
  }
  throw new Error('All API keys failed.');
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { q, page = 1, pageSize = 10, sortBy = 'publishedAt' } = req.query;

    try {
      const data = await fetchEverythingWithRotatingKeys(q, page, pageSize, sortBy);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      res.status(500).json({ error: 'Failed to fetch search results', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
