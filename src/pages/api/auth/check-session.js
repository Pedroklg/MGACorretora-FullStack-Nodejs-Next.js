import { withSession } from '../utils/session';

export default withSession(async (req, res) => {
  const adminLoggedIn = req.session.get('adminLoggedIn');

  if (adminLoggedIn) {
    res.status(200).json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});