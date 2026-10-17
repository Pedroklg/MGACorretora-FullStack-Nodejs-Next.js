import { Pool } from 'pg';

// DATABASE_SSL=false desliga o TLS (banco local). Com DATABASE_CA_CERT o certificado
// do servidor é verificado; sem ele o TLS fica ativo mas sem verificação (padrão do Heroku Postgres).
const buildSslConfig = () => {
    if (process.env.DATABASE_SSL === 'false') return false;
    if (process.env.DATABASE_CA_CERT) {
        return { ca: process.env.DATABASE_CA_CERT.replace(/\\n/g, '\n'), rejectUnauthorized: true };
    }
    return { rejectUnauthorized: false };
};

// Reaproveita o pool entre hot reloads em desenvolvimento
const globalForPg = globalThis;
const pool = globalForPg.__mgaPgPool || new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: buildSslConfig(),
    max: Number(process.env.DATABASE_POOL_MAX) || 10,
});
if (process.env.NODE_ENV !== 'production') globalForPg.__mgaPgPool = pool;

const query = async (text, params = []) => {
    try {
        // Sempre com array de parâmetros: o pg usa o protocolo estendido,
        // que não aceita múltiplos comandos na mesma query.
        return await pool.query(text, params);
    } catch (err) {
        console.error('Error executing query:', err.message);
        throw err;
    }
};

const db = {
    query,
};

export default db;
