import db from '@/lib/db';
import bcrypt from 'bcrypt';
import { getSession, isAdmin, isSameOrigin } from '@/lib/session';
import { enforceRateLimit, getClientIp, rateLimit, resetRateLimit } from '@/lib/rateLimit';

// Hash válido usado quando o usuário não existe, para o tempo de resposta não revelar quais usuários existem
const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.ZqAPm7y1H0yBzMsoQ0F2yWJ6Y6dC';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const session = await getSession(req, res);
  if (isAdmin(session)) {
    return res.status(200).json({ message: 'Already logged in' });
  }

  if (!enforceRateLimit(req, res, { name: 'login', limit: 10, windowMs: FIFTEEN_MINUTES })) {
    return;
  }

  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
    return res.status(400).json({ message: 'Missing username, password' });
  }

  if (username.length > 100 || password.length > 200) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Limite extra por usuário, contra tentativas distribuídas em vários IPs
  const perUser = rateLimit({ key: `login-user:${username.toLowerCase()}`, limit: 20, windowMs: FIFTEEN_MINUTES });
  if (!perUser.allowed) {
    res.setHeader('Retry-After', String(perUser.retryAfter));
    return res.status(429).json({ message: 'Muitas tentativas. Tente novamente mais tarde.' });
  }

  try {
    const result = await db.query('SELECT id, password FROM admins WHERE username = $1', [username]);
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (user && match) {
      session.adminLoggedIn = true;
      session.adminId = user.id;
      session.lastLoginTimestamp = Date.now();
      await session.save();
      resetRateLimit(`login:${getClientIp(req)}`);
      resetRateLimit(`login-user:${username.toLowerCase()}`);
      return res.status(200).json({ message: 'Login successful' });
    }

    console.warn(`Failed admin login from ${getClientIp(req)}`);
    return res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default handler;
