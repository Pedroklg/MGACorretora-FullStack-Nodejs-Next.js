import { isSameOrigin } from './session';
import { enforceRateLimit, getClientIp } from './rateLimit';
import { verifyRecaptcha } from './recaptcha';

const ONE_HOUR = 60 * 60 * 1000;

// Validações comuns dos formulários públicos. Retorna false se já respondeu à requisição.
export const guardPublicForm = async (req, res, { name, recaptchaAction }) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
        return false;
    }

    if (!isSameOrigin(req)) {
        res.status(403).json({ success: false, error: 'Forbidden' });
        return false;
    }

    if (!enforceRateLimit(req, res, { name, limit: 10, windowMs: ONE_HOUR })) {
        return false;
    }

    const body = req.body;
    if (!body || typeof body !== 'object') {
        res.status(400).json({ success: false, error: 'Invalid body' });
        return false;
    }

    // Campo "website" fica escondido no formulário: só robôs o preenchem
    if (body.website) {
        res.status(200).json({ success: true });
        return false;
    }

    const human = await verifyRecaptcha(body.recaptchaToken, recaptchaAction, getClientIp(req));
    if (!human) {
        res.status(400).json({ success: false, error: 'Falha na verificação anti-spam' });
        return false;
    }

    return true;
};
