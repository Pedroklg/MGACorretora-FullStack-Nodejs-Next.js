import { validateRecaptcha } from './utils/recaptcha';

export default async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Token is missing' });
  }

  const isRecaptchaValid = await validateRecaptcha(token);

  if (isRecaptchaValid) {
    res.status(200).json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
  }
};
