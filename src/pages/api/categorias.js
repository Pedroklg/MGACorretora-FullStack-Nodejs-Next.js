import { getCategorias } from '@/lib/listings';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const result = await getCategorias();
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching categorias:', error.message);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
