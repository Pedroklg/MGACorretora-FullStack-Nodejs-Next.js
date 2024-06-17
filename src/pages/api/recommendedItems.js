import db from './utils/db';

export default async function handler(req, res) {
    const { tipo, id } = req.query;

    try {
        let recommendedItems = [];

        if (tipo === 'Empresa') {
            recommendedItems = await getRecommendedEmpresas(id);
        } else if (tipo === 'Imovel') {
            recommendedItems = await getRecommendedImoveis(id);
        }

        res.status(200).json(recommendedItems);
    } catch (error) {
        console.error('Error fetching recommended items:', error);
        res.status(500).json({ error: 'Failed to fetch recommended items' });
    }
}

async function getRecommendedEmpresas(id) {
    try {
        const searchQueryEmpresas = `
            SELECT id, titulo, imagem, estado, cidade, bairro, valor_pretendido, categoria
            FROM empresas
            WHERE id != $1
              AND (categoria = (SELECT categoria FROM empresas WHERE id = $1) OR
                   bairro = (SELECT bairro FROM empresas WHERE id = $1) OR
                   cidade = (SELECT cidade FROM empresas WHERE id = $1) OR
                   estado = (SELECT estado FROM empresas WHERE id = $1) OR
                   valor_pretendido BETWEEN (SELECT valor_pretendido FROM empresas WHERE id = $1) - 100000
                                         AND (SELECT valor_pretendido FROM empresas WHERE id = $1) + 100000)
            ORDER BY RANDOM()
            LIMIT 4;
        `;

        const recommendedEmpresas = await db.query(searchQueryEmpresas, [id]);

        return recommendedEmpresas.rows;
    } catch (error) {
        console.error('Error fetching recommended empresas:', error);
        return [];
    }
}


async function getRecommendedImoveis(id) {
    try {
        const searchQueryImoveis = `
            SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, aluguel
            FROM imoveis
            WHERE id != $1
              AND (bairro = (SELECT bairro FROM imoveis WHERE id = $1) OR
                   cidade = (SELECT cidade FROM imoveis WHERE id = $1) OR
                   estado = (SELECT estado FROM imoveis WHERE id = $1) OR
                   valor_pretendido BETWEEN (SELECT valor_pretendido FROM imoveis WHERE id = $1) - 100000
                                         AND (SELECT valor_pretendido FROM imoveis WHERE id = $1) + 100000
                   AND aluguel = (SELECT aluguel FROM imoveis WHERE id = $1))
            ORDER BY RANDOM()
            LIMIT 4;
        `;

        const recommendedImoveis = await db.query(searchQueryImoveis, [id]);

        return recommendedImoveis.rows;
    } catch (error) {
        console.error('Error fetching recommended imoveis:', error);
        return [];
    }
}