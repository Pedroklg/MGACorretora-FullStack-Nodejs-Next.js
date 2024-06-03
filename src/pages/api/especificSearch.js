import db from './utils/db';

export default async function handler(req, res) {
    const { cidade, estado, categoria, minPrice, maxPrice } = req.query;

    let searchQueryEmpresas = `
        SELECT id, titulo, sobre_o_imovel, imagem, NULL AS area_construida, NULL AS area_util, NULL AS aceita_permuta,
        NULL AS tem_divida, NULL AS motivo_da_venda, valor_pretendido, NULL AS condicoes, estado, cidade, endereco, categoria
        FROM empresas
        WHERE 1=1
    `;

    if (cidade) {
        searchQueryEmpresas += ` AND LOWER(cidade) LIKE LOWER('%${cidade}%')`; // Case-insensitive comparison
    }
    if (estado) {
        searchQueryEmpresas += ` AND LOWER(estado) LIKE LOWER('%${estado}%')`; // Case-insensitive comparison
    }
    if (categoria) {
        searchQueryEmpresas += ` AND LOWER(categoria) LIKE LOWER('%${categoria}%')`; // Case-insensitive comparison
    }
    if (minPrice) {
        searchQueryEmpresas += ` AND valor_pretendido >= ${minPrice}`;
    }
    if (maxPrice) {
        searchQueryEmpresas += ` AND valor_pretendido <= ${maxPrice}`;
    }

    let searchQueryImoveis = `
        SELECT id, titulo, sobre_o_imovel, imagem, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda,
        valor_pretendido, condicoes, estado, cidade, endereco, NULL AS categoria
        FROM imoveis
        WHERE 1=1
    `;

    if (cidade) {
        searchQueryImoveis += ` AND LOWER(cidade) LIKE LOWER('%${cidade}%')`; // Case-insensitive comparison
    }
    if (estado) {
        searchQueryImoveis += ` AND LOWER(estado) LIKE LOWER('%${estado}%')`; // Case-insensitive comparison
    }
    if (minPrice) {
        searchQueryImoveis += ` AND valor_pretendido >= ${minPrice}`;
    }
    if (maxPrice) {
        searchQueryImoveis += ` AND valor_pretendido <= ${maxPrice}`;
    }

    try {
        const { rows: empresas } = await db.query(searchQueryEmpresas);

        if (empresas.length === 0) {
            const { rows: imoveis } = await db.query(searchQueryImoveis);
            res.status(200).json(imoveis);
        } else {
            res.status(200).json(empresas);
        }
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
