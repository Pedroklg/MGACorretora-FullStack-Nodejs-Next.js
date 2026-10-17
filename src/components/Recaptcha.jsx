import Script from 'next/script';
import { useCallback } from 'react';

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

// Carrega o reCAPTCHA v3 só nas páginas com formulário e só se a chave estiver configurada
export function RecaptchaScript() {
    if (!SITE_KEY) return null;
    return <Script src={`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`} strategy="afterInteractive" />;
}

const waitForRecaptcha = async (timeoutMs = 8000) => {
    const start = Date.now();
    while (!window.grecaptcha && Date.now() - start < timeoutMs) {
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return Boolean(window.grecaptcha);
};

export const isRecaptchaConfigured = Boolean(SITE_KEY);

// Retorna o token, ou null se o reCAPTCHA não está configurado ou não carregou a tempo
export function useRecaptcha() {
    return useCallback(async (action) => {
        if (!SITE_KEY || typeof window === 'undefined') return null;
        if (!(await waitForRecaptcha())) return null;
        return new Promise((resolve) => {
            window.grecaptcha.ready(() => {
                window.grecaptcha.execute(SITE_KEY, { action }).then(resolve).catch(() => resolve(null));
            });
        });
    }, []);
}

// Campo invisível para pessoas; robôs costumam preenchê-lo
export function HoneypotField({ value, onChange }) {
    return (
        <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="website">Não preencha este campo</label>
            <input id="website" type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={onChange} />
        </div>
    );
}
