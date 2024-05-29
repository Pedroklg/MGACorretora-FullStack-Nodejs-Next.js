import db from './db';

export default async function handler(req, res) {
    const { query } = req.query;

    try {
        // Query the database for matching results in imoveis and empresas tables
        const results = await db.query(`
            SELECT id, titulo, sobre_o_imovel, estado, cidade FROM imoveis 
            WHERE titulo ILIKE $1 OR sobre_o_imovel ILIKE $1 OR estado ILIKE $1 OR cidade ILIKE $1
            UNION
            SELECT id, nome AS titulo, descricao AS sobre_o_imovel, estado, cidade FROM empresas 
            WHERE nome ILIKE $1 OR descricao ILIKE $1 OR estado ILIKE $1 OR cidade ILIKE $1
            UNION
            SELECT id, nome AS titulo, descricao AS sobre_o_imovel, NULL AS estado, NULL AS cidade FROM categorias
            WHERE nome ILIKE $1 OR descricao ILIKE $1 OR estado ILIKE $1
    
    `, [`%${query}%`]);

        res.status(200).json(results.rows);
    } catch (error) {
        console.error('Error executing search query:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
