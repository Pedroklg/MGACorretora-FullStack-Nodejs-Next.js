import db from '@/lib/db';
import { escapeLike } from '@/lib/sqlUtils';

const IMOVEL_COLUMNS = `id, titulo, imagem, valor_pretendido, estado, cidade, bairro, aluguel, NULL::varchar AS categoria, 'Imovel' AS tipo`;
const EMPRESA_COLUMNS = `id, titulo, imagem, valor_pretendido, estado, cidade, bairro, NULL::boolean AS aluguel, categoria, 'Empresa' AS tipo`;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const query = typeof req.query.query === 'string' ? req.query.query.trim().slice(0, 100) : '';

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  let searchQuery;
  let queryParams;

  if (/^\d+$/.test(query)) {
    // Busca pelo código do anúncio
    searchQuery = `
      SELECT ${IMOVEL_COLUMNS} FROM imoveis WHERE CAST(id AS TEXT) = $1 OR titulo ILIKE $2 ESCAPE '\\'
      UNION ALL
      SELECT ${EMPRESA_COLUMNS} FROM empresas WHERE CAST(id AS TEXT) = $1 OR titulo ILIKE $2 ESCAPE '\\'
    `;
    queryParams = [query, `%${escapeLike(query)}%`];
  } else {
    const matchComodos = query.match(/\d+/);

    if (matchComodos) {
      // Ex.: "3 quartos" -> imóveis com 3 cômodos chamados "quartos"
      const searchQuantity = parseInt(matchComodos[0], 10);
      const searchName = `%${escapeLike(query.replace(matchComodos[0], '').trim())}%`;

      searchQuery = `
        SELECT ${IMOVEL_COLUMNS}
        FROM imoveis
        WHERE EXISTS (
            SELECT 1
            FROM jsonb_array_elements(comodos::jsonb) AS comodo
            WHERE (comodo->>'nome') ILIKE $1 ESCAPE '\\'
              AND (comodo->>'quantidade') ~ '^[0-9]+$'
              AND (comodo->>'quantidade')::int = $2
        )
        UNION ALL
        SELECT ${EMPRESA_COLUMNS}
        FROM empresas
        WHERE titulo ILIKE $1 ESCAPE '\\' OR categoria ILIKE $1 ESCAPE '\\'
      `;
      queryParams = [searchName, searchQuantity];
    } else {
      searchQuery = `
        SELECT ${IMOVEL_COLUMNS}
        FROM imoveis
        WHERE estado ILIKE $1 ESCAPE '\\'
           OR cidade ILIKE $1 ESCAPE '\\'
           OR titulo ILIKE $1 ESCAPE '\\'
           OR bairro ILIKE $1 ESCAPE '\\'
           OR descricao ILIKE $1 ESCAPE '\\'
        UNION ALL
        SELECT ${EMPRESA_COLUMNS}
        FROM empresas
        WHERE estado ILIKE $1 ESCAPE '\\'
           OR cidade ILIKE $1 ESCAPE '\\'
           OR titulo ILIKE $1 ESCAPE '\\'
           OR categoria ILIKE $1 ESCAPE '\\'
           OR bairro ILIKE $1 ESCAPE '\\'
           OR descricao ILIKE $1 ESCAPE '\\'
      `;
      queryParams = [`%${escapeLike(query)}%`];
    }
  }

  try {
    const { rows } = await db.query(searchQuery, queryParams);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error executing query', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
