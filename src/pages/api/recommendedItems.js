import { getRecommended, parseId } from '@/lib/listings';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { tipo } = req.query;
    const id = parseId(req.query.id);
    if (!id) {
        return res.status(400).json({ error: 'Invalid id' });
    }

    try {
        const recommendedItems = await getRecommended(tipo, id);
        res.status(200).json(recommendedItems);
    } catch (error) {
        console.error('Error fetching recommended items:', error.message);
        res.status(500).json({ error: 'Failed to fetch recommended items' });
    }
}
