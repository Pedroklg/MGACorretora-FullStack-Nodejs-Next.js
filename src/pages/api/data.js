import db from './utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tipoMostrado, estado, cidade, categoria, minPrice, maxPrice, q } = req.query;

    let queryText = '';
    let queryParams = [];

    const addFilter = (filter, value) => {
      queryText += filter;
      queryParams.push(value);
    };

    if (tipoMostrado === 'Empresas') {
      queryText = 'SELECT * FROM empresas WHERE 1=1';
    } else if (tipoMostrado === 'Imoveis') {
      queryText = 'SELECT * FROM imoveis WHERE 1=1';
    } else {
      queryText = `
        SELECT id, titulo, sobre_o_imovel, NULL AS area_construida, NULL AS area_util, NULL AS aceita_permuta, NULL AS tem_divida, NULL AS motivo_da_venda, valor_pretendido, NULL AS condicoes, estado, cidade, endereco
        FROM empresas
        UNION ALL
        SELECT id, titulo, sobre_o_imovel, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda, valor_pretendido, condicoes, estado, cidade, endereco
        FROM imoveis
      `;
    }

    if (estado) addFilter(` AND estado = $${queryParams.length + 1}`, estado);
    if (cidade) addFilter(` AND cidade = $${queryParams.length + 1}`, cidade);
    if (categoria) addFilter(` AND categoria = $${queryParams.length + 1}`, categoria);
    if (minPrice) addFilter(` AND valor_pretendido >= $${queryParams.length + 1}`, minPrice);
    if (maxPrice) addFilter(` AND valor_pretendido <= $${queryParams.length + 1}`, maxPrice);
    if (q) {
      const likeValue = `%${q}%`;
      addFilter(` AND (titulo ILIKE $${queryParams.length + 1} OR sobre_o_imovel ILIKE $${queryParams.length + 1})`, likeValue);
    }

    try {
      const result = await db.query(queryText, queryParams);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
