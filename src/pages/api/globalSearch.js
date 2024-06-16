import db from './utils/db';

export default async function handler(req, res) {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  let searchQuery;
  const searchTerm = '%' + query + '%';
  let queryParams = [];

    searchQuery = `
      SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro
      FROM empresas
      WHERE estado ILIKE $1
         OR cidade ILIKE $1
         OR titulo ILIKE $1
         OR categoria ILIKE $1
         OR CAST(id AS TEXT) ILIKE $1
         OR bairro ILIKE $1
      UNION ALL
      SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro
      FROM imoveis
      WHERE estado ILIKE $2
         OR cidade ILIKE $2
         OR titulo ILIKE $2
         OR CAST(id AS TEXT) ILIKE $2
         OR bairro ILIKE $2
    `;
    queryParams.push(searchTerm, searchTerm);

  try {
    const { rows } = await db.query(searchQuery, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
