import db from './utils/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tipoMostrado, q } = req.query;
    let queryText;

    if (tipoMostrado === 'Empresas') {
      queryText = 'SELECT * FROM empresas WHERE 1=1';
    } else if (tipoMostrado === 'Imoveis') {
      queryText = 'SELECT * FROM imoveis WHERE 1=1';
    } else {
      queryText = `
        SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, descricao
        FROM empresas
        UNION ALL
        SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, descricao
        FROM imoveis
      `;
    }

    try {
      const result = await db.query(queryText);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
