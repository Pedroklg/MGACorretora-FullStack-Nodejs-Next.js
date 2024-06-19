import db from '../utils/db';
import bcrypt from 'bcrypt';
import { withSession } from '../utils/session';
import { validateRecaptcha } from '../utils/recaptcha'; // Helper function to validate reCAPTCHA

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { username, password, token } = req.body;

  try {
    // Verify reCAPTCHA token
    const isRecaptchaValid = await validateRecaptcha(token);
    if (!isRecaptchaValid) {
      return res.status(400).json({ message: 'reCAPTCHA validation failed' });
    }

    const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = result.rows[0];
    const hashedPasswordFromDatabase = user.password;

    const match = await bcrypt.compare(password, hashedPasswordFromDatabase);

    if (match) {
      req.session.set('adminLoggedIn', true);
      req.session.set('lastLoginTimestamp', Date.now());

      await req.session.save();
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

export default withSession(handler);
