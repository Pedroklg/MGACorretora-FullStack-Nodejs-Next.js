import { GoogleReCaptchaV3 } from 'react-google-recaptcha-v3';

const { RECAPTCHA_SECRET_KEY } = process.env;

async function validateRecaptcha(token) {
  try {
    const recaptcha = new GoogleReCaptchaV3();
    const response = await recaptcha.verify(token, RECAPTCHA_SECRET_KEY);
    return response.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export { validateRecaptcha };