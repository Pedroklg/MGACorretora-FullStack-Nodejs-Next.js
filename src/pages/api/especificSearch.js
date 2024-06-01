import db from './utils/db';

export default async function handler(req, res) {
    const { cidade, estado, categoria, minPrice, maxPrice } = req.query;

    let searchQuery = `
        SELECT id, titulo, sobre_o_imovel, NULL AS area_construida, NULL AS area_util, NULL AS aceita_permuta,
        NULL AS tem_divida, NULL AS motivo_da_venda, valor_pretendido, NULL AS condicoes, estado, cidade, endereco, categoria
        FROM empresas
        WHERE 1=1
    `;

    if (cidade) {
        searchQuery += ` AND LOWER(cidade) LIKE LOWER('%${cidade}%')`; // Case-insensitive comparison
    }
    if (estado) {
        searchQuery += ` AND LOWER(estado) LIKE LOWER('%${estado}%')`; // Case-insensitive comparison
    }
    if (categoria) {
        searchQuery += ` AND LOWER(categoria) LIKE LOWER('%${categoria}%')`; // Case-insensitive comparison
    }
    if (minPrice) {
        searchQuery += ` AND valor_pretendido >= ${minPrice}`;
    }
    if (maxPrice) {
        searchQuery += ` AND valor_pretendido <= ${maxPrice}`;
    }

    console.log('Generated SQL query:', searchQuery); // Debugging: Print generated SQL query

    try {
        const { rows } = await db.query(searchQuery);
        console.log('Query result:', rows); // Debugging: Print query result
        console.log('Estado:', estado);
        console.log('Cidade:', cidade);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
