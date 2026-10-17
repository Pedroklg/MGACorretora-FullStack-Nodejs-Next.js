import { getSession, isAdmin } from '@/lib/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const session = await getSession(req, res);
  res.setHeader('Cache-Control', 'no-store');

  if (isAdmin(session)) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
}
