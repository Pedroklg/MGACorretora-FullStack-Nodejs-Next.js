// Limite de requisições em memória, por IP. Suficiente para uma única instância (um dyno);
// com várias instâncias, trocar por um armazenamento compartilhado (ex.: Redis).
const buckets = new Map();

// Quantos proxies confiáveis ficam na frente do app. Heroku sozinho: 1 (padrão).
// Cloudflare/CDN + Heroku: 2. Sem proxy (next start direto): 0, e o X-Forwarded-For é ignorado.
const TRUSTED_PROXY_HOPS = Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? '1', 10);

export const getClientIp = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded && TRUSTED_PROXY_HOPS > 0) {
        // Cada proxy confiável acrescenta o IP de quem o chamou ao final do cabeçalho
        const parts = String(forwarded).split(',').map((part) => part.trim()).filter(Boolean);
        const index = parts.length - TRUSTED_PROXY_HOPS;
        if (index >= 0) return parts[index];
    }
    return req.socket?.remoteAddress || 'unknown';
};

export const rateLimit = ({ key, limit, windowMs }) => {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { allowed: true, retryAfter: 0 };
    }

    bucket.count += 1;
    if (bucket.count > limit) {
        return { allowed: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    return { allowed: true, retryAfter: 0 };
};

export const resetRateLimit = (key) => buckets.delete(key);

// Responde 429 e retorna false quando o limite estoura
export const enforceRateLimit = (req, res, { name, limit, windowMs }) => {
    const result = rateLimit({ key: `${name}:${getClientIp(req)}`, limit, windowMs });
    if (!result.allowed) {
        res.setHeader('Retry-After', String(result.retryAfter));
        res.status(429).json({ success: false, message: 'Muitas tentativas. Tente novamente mais tarde.' });
        return false;
    }
    return true;
};

const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
        if (bucket.resetAt <= now) buckets.delete(key);
    }
}, 60 * 1000);
cleanup.unref?.();
