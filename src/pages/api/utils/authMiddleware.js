import { withSession } from './session';

const requireAuth = (handler) => {
  return withSession(async (req, res) => {
    const adminLoggedIn = req.session.get('adminLoggedIn');

    if (!adminLoggedIn) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    return handler(req, res);
  });
};

export default requireAuth;
