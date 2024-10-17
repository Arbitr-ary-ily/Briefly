// pages/api/categories.js
import { getCategories } from '../../lib/newsapi'; // You'll need to implement this function

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const categories = await getCategories();
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}