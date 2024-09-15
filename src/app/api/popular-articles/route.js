import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiKey) {
      throw new Error('Missing NEWS_API_KEY');
    }

    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const newsApiUrl = `${proxyUrl}https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;

    // Request options for CORS proxy
    const response = await axios.get(newsApiUrl, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
  }
}
