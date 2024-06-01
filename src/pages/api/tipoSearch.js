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
        SELECT id, titulo, sobre_o_imovel, NULL AS area_construida, NULL AS area_util, NULL AS aceita_permuta, NULL AS tem_divida, NULL AS motivo_da_venda, valor_pretendido, NULL AS condicoes, estado, cidade, endereco
        FROM empresas
        UNION ALL
        SELECT id, titulo, sobre_o_imovel, area_construida, area_util, aceita_permuta, tem_divida, motivo_da_venda, valor_pretendido, condicoes, estado, cidade, endereco
        FROM imoveis
      `;
    }

    try {
      const result = await db.query(queryText); // Pass the queryText to db.query()
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
