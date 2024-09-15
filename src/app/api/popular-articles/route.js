import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;

    if (!newsApiKey) {
      throw new Error('Missing NEWS_API_KEY');
    }

    // Backend server-to-server request to the NewsAPI
    const newsApiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${newsApiKey}`;

    // Make the request from the backend to bypass CORS issues
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
    console.error('Error fetching articles:', error);
    return NextResponse.json({ error: 'Failed to fetch articles', details: error.message }, { status: 500 });
  }
}
