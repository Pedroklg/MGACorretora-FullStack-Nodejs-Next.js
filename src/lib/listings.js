import db from './db';

// Converte Date e afins em valores serializáveis para getServerSideProps
export const serialize = (value) => JSON.parse(JSON.stringify(value ?? null));

export const parseId = (value) => {
    const match = String(value ?? '').match(/^(\d{1,10})(?:-|$)/);
    if (!match) return null;
    const id = Number(match[1]);
    return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const CARD_COLUMNS_EMPRESA = `id, titulo, imagem, valor_pretendido, estado, cidade, bairro, categoria, NULL::boolean AS aluguel, 'Empresa' AS tipo`;
const CARD_COLUMNS_IMOVEL = `id, titulo, imagem, valor_pretendido, estado, cidade, bairro, NULL::varchar AS categoria, aluguel, 'Imovel' AS tipo`;

// withDescription: inclui a descrição (usada pela tabela do admin); as páginas públicas não precisam dela
export const getCardListings = async (tipoMostrado = 'ambos', { withDescription = false } = {}) => {
    const extra = withDescription ? ', descricao' : '';
    const empresaColumns = CARD_COLUMNS_EMPRESA + extra;
    const imovelColumns = CARD_COLUMNS_IMOVEL + extra;
    let queryText;
    if (tipoMostrado === 'Empresas') {
        queryText = `SELECT ${empresaColumns} FROM empresas ORDER BY id DESC`;
    } else if (tipoMostrado === 'Imoveis') {
        queryText = `SELECT ${imovelColumns} FROM imoveis ORDER BY id DESC`;
    } else {
        queryText = `
            SELECT * FROM (
                SELECT ${empresaColumns} FROM empresas
                UNION ALL
                SELECT ${imovelColumns} FROM imoveis
            ) AS anuncios
            ORDER BY id DESC
        `;
    }
    const { rows } = await db.query(queryText);
    return serialize(rows);
};

export const getListingById = async (id) => {
    const empresa = await db.query('SELECT * FROM empresas WHERE id = $1', [id]);
    if (empresa.rows.length > 0) {
        return serialize({ tipo: 'Empresa', item: empresa.rows[0] });
    }

    const imovel = await db.query('SELECT * FROM imoveis WHERE id = $1', [id]);
    if (imovel.rows.length > 0) {
        return serialize({ tipo: 'Imovel', item: imovel.rows[0] });
    }

    return null;
};

export const getRecommendedEmpresas = async (id) => {
    const { rows } = await db.query(`
        WITH alvo AS (SELECT categoria, bairro, cidade, estado FROM empresas WHERE id = $1)
        SELECT e.id, e.titulo, e.imagem, e.estado, e.cidade, e.bairro, e.valor_pretendido, e.categoria
        FROM empresas e, alvo a
        WHERE e.id != $1
          AND (e.categoria = a.categoria OR e.bairro = a.bairro OR e.cidade = a.cidade OR e.estado = a.estado)
        ORDER BY
            CASE
                WHEN e.categoria = a.categoria THEN 1
                WHEN e.bairro = a.bairro THEN 2
                WHEN e.cidade = a.cidade THEN 3
                WHEN e.estado = a.estado THEN 4
                ELSE 5
            END
        LIMIT 4
    `, [id]);
    return serialize(rows);
};

export const getRecommendedImoveis = async (id) => {
    const { rows } = await db.query(`
        WITH alvo AS (SELECT bairro, cidade, estado, aluguel FROM imoveis WHERE id = $1)
        SELECT i.id, i.titulo, i.imagem, i.valor_pretendido, i.estado, i.cidade, i.bairro, i.aluguel
        FROM imoveis i, alvo a
        WHERE i.id != $1
          AND (i.bairro = a.bairro OR i.cidade = a.cidade OR i.estado = a.estado OR i.aluguel = a.aluguel)
        ORDER BY
            CASE
                WHEN i.bairro = a.bairro THEN 1
                WHEN i.cidade = a.cidade THEN 2
                WHEN i.estado = a.estado THEN 3
                WHEN i.aluguel = a.aluguel THEN 4
                ELSE 5
            END
        LIMIT 4
    `, [id]);
    return serialize(rows);
};

export const getRecommended = async (tipo, id) => {
    if (tipo === 'Empresa') return getRecommendedEmpresas(id);
    if (tipo === 'Imovel') return getRecommendedImoveis(id);
    return [];
};

export const getCategorias = async () => {
    const { rows } = await db.query('SELECT DISTINCT categoria FROM empresas WHERE categoria IS NOT NULL ORDER BY categoria');
    return serialize(rows);
};

// Usado pelo sitemap.xml e pelo llms.txt
export const getIndexableListings = async () => {
    const { rows } = await db.query(`
        SELECT id, titulo, cidade, estado, valor_pretendido, data_registro, 'Empresa' AS tipo, categoria, NULL::boolean AS aluguel FROM empresas
        UNION ALL
        SELECT id, titulo, cidade, estado, valor_pretendido, data_registro, 'Imovel' AS tipo, NULL::varchar AS categoria, aluguel FROM imoveis
        ORDER BY id DESC
    `);
    return serialize(rows);
};
