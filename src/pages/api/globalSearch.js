import db from './utils/db';

export default async function handler(req, res) {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  let searchQuery;
  const searchTerm = '%' + query + '%';
  let queryParams = [searchTerm, searchTerm];

  // Check if query contains a number (indicating search for comodos)
  const matchComodos = query.match(/\d+/);

  if (matchComodos) {
    const searchQuantity = parseInt(matchComodos[0], 10);
    const searchName = query.replace(searchQuantity, '').trim();

    // Adjust search query and parameters for comodos search
    searchQuery = `
      SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, 'imovel' AS tipo
      FROM (
          SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, descricao
          FROM imoveis
          WHERE EXISTS (
              SELECT 1
              FROM jsonb_array_elements(comodos::jsonb) AS comodo
              WHERE (comodo->>'nome') ILIKE $1
                AND (comodo->>'quantidade')::int = $2
          )
          UNION ALL
          SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, 'empresa' AS tipo
          FROM empresas
          WHERE (titulo ILIKE $3 OR categoria ILIKE $3)
      ) AS resultados
    `;

    // Adjust queryParams for comodos search
    queryParams = [ `%${searchName}%`, searchQuantity, `%${searchName}%` ];
  } else {
    // Default keyword search (no comodos specified)
    searchQuery = `
      SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, 'imovel' AS tipo
      FROM imoveis
      WHERE estado ILIKE $1
         OR cidade ILIKE $1
         OR titulo ILIKE $1
         OR CAST(id AS TEXT) ILIKE $1
         OR bairro ILIKE $1
         OR descricao ILIKE $1
      UNION ALL
      SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, 'empresa' AS tipo
      FROM empresas
      WHERE estado ILIKE $2
         OR cidade ILIKE $2
         OR titulo ILIKE $2
         OR categoria ILIKE $2
         OR CAST(id AS TEXT) ILIKE $2
         OR bairro ILIKE $2
         OR descricao ILIKE $2
    `;
  }

  try {
    const { rows } = await db.query(searchQuery, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
