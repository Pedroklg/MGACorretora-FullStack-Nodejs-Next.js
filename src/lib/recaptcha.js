// Verificação do reCAPTCHA v3. Só é exigida quando as duas chaves (pública e secreta) estão configuradas,
// para uma chave pública ausente não fazer o servidor recusar todos os envios.
export const isRecaptchaEnabled = () => Boolean(process.env.RECAPTCHA_SECRET_KEY && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);

export const verifyRecaptcha = async (token, expectedAction, remoteIp) => {
    if (!isRecaptchaEnabled()) return true;
    if (!token || typeof token !== 'string') return false;

    try {
        const params = new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: token });
        if (remoteIp) params.set('remoteip', remoteIp);

        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params,
        });
        const data = await response.json();
        const minScore = Number(process.env.RECAPTCHA_MIN_SCORE) || 0.5;

        return Boolean(data.success)
            && (!expectedAction || data.action === expectedAction)
            && (typeof data.score !== 'number' || data.score >= minScore);
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error.message);
        return false;
    }
};
