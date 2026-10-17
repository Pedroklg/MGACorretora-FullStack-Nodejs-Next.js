import { getSession, isSameOrigin } from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  if (!isSameOrigin(req)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  const session = await getSession(req, res);
  session.destroy();
  res.status(200).json({ message: 'Logged out' });
}
