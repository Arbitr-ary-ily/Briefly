import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    const guardianApiKey = process.env.GUARDIAN_API_KEY;
    const nytApiKey = process.env.NYT_API_KEY;

    if (!newsApiKey || !guardianApiKey || !nytApiKey) {
      throw new Error('Missing API keys');
    }

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const newsApiUrl = `${proxyUrl}https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${newsApiKey}`;
    const guardianUrl = `${proxyUrl}https://content.guardianapis.com/search?q=${encodeURIComponent(q)}&api-key=${guardianApiKey}&show-fields=thumbnail,headline,byline,trailText`;
    const nytUrl = `${proxyUrl}https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${encodeURIComponent(q)}&api-key=${nytApiKey}`;

    const [newsApiResponse, guardianResponse, nytResponse] = await Promise.all([
      axios.get(newsApiUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }),
      axios.get(guardianUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }),
      axios.get(nytUrl, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
    ]);

    const articles = [
      // NewsAPI results
      ...newsApiResponse.data.articles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source.name
      })),
    ];

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json({ error: 'Failed to search articles' }, { status: 500 });
  }
}
