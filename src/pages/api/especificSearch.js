import db from './utils/db';

export default async function handler(req, res) {
    const { cidade, estado, bairro, categoria, finalidade, minPrice, maxPrice, searchMode } = req.query;
    let aluguel = null;
    if (finalidade === 'venda') {
        aluguel = false;
    }else if (finalidade === 'locacao') {
        aluguel = true;
    }
    console.log(aluguel);

    // Initialize search queries
    let searchQueryEmpresas = `
        SELECT id, titulo, imagem, estado, cidade, bairro, valor_pretendido, categoria
        FROM empresas
        WHERE 1=1
    `;

    let searchQueryImoveis = `
        SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, aluguel
        FROM imoveis
        WHERE 1=1
    `; 

    // Add filters based on provided parameters
    if (cidade) {
        searchQueryEmpresas += ` AND LOWER(cidade) LIKE LOWER('%${cidade}%')`;
        searchQueryImoveis += ` AND LOWER(cidade) LIKE LOWER('%${cidade}%')`;
    }
    if (estado) {
        searchQueryEmpresas += ` AND LOWER(estado) LIKE LOWER('%${estado}%')`;
        searchQueryImoveis += ` AND LOWER(estado) LIKE LOWER('%${estado}%')`;
    }
    if (bairro) {
        searchQueryEmpresas += ` AND LOWER(bairro) LIKE LOWER('%${bairro}%')`;
        searchQueryImoveis += ` AND LOWER(bairro) LIKE LOWER('%${bairro}%')`;
    }
    if (categoria) {
        searchQueryEmpresas += ` AND LOWER(categoria) LIKE LOWER('%${categoria}%')`;
    }
    if (aluguel !== null){
        searchQueryImoveis += ` AND aluguel = ${aluguel}`;
    }
    if (minPrice) {
        searchQueryEmpresas += ` AND valor_pretendido >= ${minPrice}`;
        searchQueryImoveis += ` AND valor_pretendido >= ${minPrice}`;
    }
    if (maxPrice) {
        searchQueryEmpresas += ` AND valor_pretendido <= ${maxPrice}`;
        searchQueryImoveis += ` AND valor_pretendido <= ${maxPrice}`;
    }

    try {
        // Execute queries to fetch data
        const { rows: empresas } = await db.query(searchQueryEmpresas);
        const { rows: imoveis } = await db.query(searchQueryImoveis);

        // Combine results based on searchMode
        let combinedResults = [];
        if (searchMode === 'both' && !categoria) {
            combinedResults = [...empresas, ...imoveis];
        } else if (searchMode === 'empresas' || categoria) {
            combinedResults = empresas;
        } else if (searchMode === 'imoveis') {
            combinedResults = imoveis;
        } else {
            return res.status(400).json({ error: 'Invalid search mode' });
        }

        // Return combined or individual results
        res.status(200).json(combinedResults);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
