// pages/api/cidades.js

import db from './utils/db';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const queryText = `SELECT DISTINCT cidade FROM empresas WHERE cidade IS NOT NULL 
                                UNION 
                                SELECT DISTINCT cidade FROM imoveis WHERE cidade IS NOT NULL`;
            const result = await db.query(queryText);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error fetching cidades:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
