import nodemailer from 'nodemailer';

let transporter;

export const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
};

export const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Remove quebras de linha e caracteres de controle (evita injeção de cabeçalhos)
export const singleLine = (value, maxLength = 200) => String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .trim()
    .slice(0, maxLength);

export const multiLine = (value, maxLength = 5000) => String(value ?? '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, '')
    .trim()
    .slice(0, maxLength);

export const isValidEmail = (value) => /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/.test(value);

// fields: [[rótulo, valor], ...]
export const sendFormEmail = async ({ fromName, subject, intro, fields, replyTo }) => {
    const text = [intro, '', ...fields.map(([label, value]) => `${label}: ${value || '-'}`)].join('\n');
    const html = `<p>${escapeHtml(intro)}</p><table cellpadding="4">${fields
        .map(([label, value]) => `<tr><td valign="top"><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value || '-').replace(/\n/g, '<br>')}</td></tr>`)
        .join('')}</table>`;

    return getTransporter().sendMail({
        from: { name: fromName, address: process.env.SMTP_USER },
        to: process.env.RECIPIENT_EMAIL,
        replyTo: replyTo && isValidEmail(replyTo) ? replyTo : undefined,
        subject: singleLine(subject, 150),
        text,
        html,
    });
};
