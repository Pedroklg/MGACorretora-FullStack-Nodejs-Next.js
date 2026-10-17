import { getIronSession } from 'iron-session';

const THREE_HOURS_IN_SECONDS = 3 * 60 * 60;

export const sessionOptions = {
    password: process.env.SESSION_PASSWORD,
    cookieName: 'admin_session',
    ttl: THREE_HOURS_IN_SECONDS,
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    },
};

export const getSession = (req, res) => {
    if (!sessionOptions.password || sessionOptions.password.length < 32) {
        throw new Error('SESSION_PASSWORD precisa ter pelo menos 32 caracteres');
    }
    return getIronSession(req, res, sessionOptions);
};

export const isAdmin = (session) => Boolean(session && session.adminLoggedIn);

// Protege rotas de API. Também barra requisições de escrita vindas de outra origem (CSRF).
export const requireAuth = (handler) => async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD' && !isSameOrigin(req)) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const session = await getSession(req, res);
    if (!isAdmin(session)) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    req.session = session;
    return handler(req, res);
};

// getServerSideProps das páginas do admin
export const protectRoute = async ({ req, res }) => {
    const session = await getSession(req, res);

    if (!isAdmin(session)) {
        return {
            redirect: {
                destination: '/admin',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export const isSameOrigin = (req) => {
    const origin = req.headers.origin || req.headers.referer;
    if (!origin) return true;

    try {
        const host = req.headers['x-forwarded-host'] || req.headers.host;
        return new URL(origin).host === host;
    } catch {
        return false;
    }
};
