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

    if (!newsApiKey) {
      throw new Error('Missing NEWS_API_KEY');
    }

    // Backend request to the NewsAPI for search functionality
    const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&apiKey=${newsApiKey}`;

    const response = await axios.get(newsApiUrl);

    // Map the articles from the response
    const articles = response.data.articles.map(article => ({
      title: article.title,
      description: article.description,
      url: article.url,
      imageUrl: article.urlToImage,
      source: article.source.name,
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error searching articles:', error);
    return NextResponse.json({ error: 'Failed to search articles', details: error.message }, { status: 500 });
  }
}
