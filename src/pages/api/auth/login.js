import db from '../utils/db';
import bcrypt from 'bcrypt';
import { withSession } from '../utils/session';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const hashedPasswordFromDatabase = user.password;

    const match = await bcrypt.compare(password, hashedPasswordFromDatabase);

    if (match) {
      req.session.set('adminLoggedIn', true);

      // Store last login timestamp (optional)
      req.session.set('lastLoginTimestamp', Date.now());

      await req.session.save();
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withSession(handler);
