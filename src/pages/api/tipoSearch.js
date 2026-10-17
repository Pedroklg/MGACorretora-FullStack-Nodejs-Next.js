import { getCardListings } from '@/lib/listings';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tipoMostrado } = req.query;

    try {
      const rows = await getCardListings(tipoMostrado, { withDescription: true });
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error in GET /api/tipoSearch:', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
