import db from '@/lib/db';
import { escapeLike } from '@/lib/sqlUtils';

const toNumber = (value) => {
    if (value === undefined || value === null || value === '' || value === 'undefined') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const toText = (value) => {
    if (typeof value !== 'string') return null;
    const text = value.trim();
    return text && text !== 'undefined' ? text.slice(0, 100) : null;
};

// Monta "WHERE" com placeholders ($1, $2...) para nunca concatenar texto do usuário na SQL
const buildFilters = (filters) => {
    const conditions = [];
    const params = [];

    for (const { column, value, operator } of filters) {
        if (value === null) continue;
        params.push(operator === 'LIKE' ? `%${escapeLike(value)}%` : value);
        const placeholder = `$${params.length}`;
        if (operator === 'LIKE') {
            conditions.push(`LOWER(${column}) LIKE LOWER(${placeholder}) ESCAPE '\\'`);
        } else {
            conditions.push(`${column} ${operator} ${placeholder}`);
        }
    }

    return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
};

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    const { finalidade, searchMode } = req.query;
    const cidade = toText(req.query.cidade);
    const estado = toText(req.query.estado);
    const bairro = toText(req.query.bairro);
    const categoria = toText(req.query.categoria);
    const minPrice = toNumber(req.query.minPrice);
    const maxPrice = toNumber(req.query.maxPrice);

    let aluguel = null;
    if (finalidade === 'venda') {
        aluguel = false;
    } else if (finalidade === 'locacao') {
        aluguel = true;
    }

    let mode;
    if (searchMode === 'both' && !categoria) {
        mode = 'both';
    } else if (searchMode === 'empresas' || categoria) {
        mode = 'empresas';
    } else if (searchMode === 'imoveis') {
        mode = 'imoveis';
    } else {
        return res.status(400).json({ error: 'Invalid search mode' });
    }

    const commonFilters = [
        { column: 'cidade', value: cidade, operator: 'LIKE' },
        { column: 'estado', value: estado, operator: 'LIKE' },
        { column: 'bairro', value: bairro, operator: 'LIKE' },
        { column: 'valor_pretendido', value: minPrice, operator: '>=' },
        { column: 'valor_pretendido', value: maxPrice, operator: '<=' },
    ];

    try {
        let empresas = [];
        let imoveis = [];

        if (mode !== 'imoveis') {
            const { where, params } = buildFilters([
                ...commonFilters,
                { column: 'categoria', value: categoria, operator: 'LIKE' },
            ]);
            ({ rows: empresas } = await db.query(
                `SELECT id, titulo, imagem, estado, cidade, bairro, valor_pretendido, categoria FROM empresas ${where}`,
                params
            ));
        }

        if (mode !== 'empresas') {
            const { where, params } = buildFilters([
                ...commonFilters,
                { column: 'aluguel', value: aluguel, operator: '=' },
            ]);
            ({ rows: imoveis } = await db.query(
                `SELECT id, titulo, imagem, valor_pretendido, estado, cidade, bairro, aluguel FROM imoveis ${where}`,
                params
            ));
        }

        res.status(200).json([...empresas, ...imoveis]);
    } catch (error) {
        console.error('Error executing query', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
