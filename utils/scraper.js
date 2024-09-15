import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    const guardianApiKey = process.env.GUARDIAN_API_KEY;
    const nytApiKey = process.env.NYT_API_KEY;

    const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;
    const guardianUrl = `https://content.guardianapis.com/search?api-key=${guardianApiKey}&show-fields=thumbnail,headline,byline,trailText`;
    const nytUrl = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${nytApiKey}`;

    const [newsApiResponse, guardianResponse, nytResponse] = await Promise.all([
      axios.get(newsApiUrl),
      axios.get(guardianUrl),
      axios.get(nytUrl)
    ]);

    const articles = [
      ...newsApiResponse.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: 'NewsAPI'
      })),
      ...guardianResponse.data.response.results.map(article => ({
        title: article.fields.headline,
        description: article.fields.trailText,
        url: article.webUrl,
        imageUrl: article.fields.thumbnail,
        source: 'The Guardian'
      })),
      ...nytResponse.data.results.map(article => ({
        title: article.title,
        description: article.abstract,
        url: article.url,
        imageUrl: article.multimedia?.[0]?.url,
        source: 'New York Times'
      }))
    ];

    res.status(200).json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}