const { RECAPTCHA_SECRET_KEY } = process.env;

async function validateRecaptcha(token) {
  console.log('RECAPTCHA_SECRET_KEY:', RECAPTCHA_SECRET_KEY); // Log the secret key (remove in production)
  console.log('Token:', token); // Log the token for debugging

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }).toString(),
    });

    const data = await response.json();
    console.log('reCAPTCHA verification response:', data); // Log the response for debugging

    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export { validateRecaptcha };
