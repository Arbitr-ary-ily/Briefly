// pages/api/generateSummary.js
import { getSummary } from '../../lib/geminiAI';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { text } = req.body;
      const summary = await getSummary(text);
      res.status(200).json({ summary });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate summary' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}