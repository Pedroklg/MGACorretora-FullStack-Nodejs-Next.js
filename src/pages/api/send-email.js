import { guardPublicForm } from '@/lib/formGuard';
import { isValidEmail, multiLine, sendFormEmail, singleLine } from '@/lib/mailer';

export default async function handler(req, res) {
  if (!(await guardPublicForm(req, res, { name: 'contact', recaptchaAction: 'contact' }))) {
    return;
  }

  const name = singleLine(req.body.name, 120);
  const email = singleLine(req.body.email, 200);
  const phone = singleLine(req.body.phone, 40);
  const subject = singleLine(req.body.subject, 150);
  const message = multiLine(req.body.message, 5000);
  const page = singleLine(req.body.page, 300);

  if (!name || (!email && !phone) || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes' });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ success: false, error: 'E-mail inválido' });
  }

  try {
    await sendFormEmail({
      fromName: 'Contato MGA Corretora',
      subject: `[Site] ${subject}`,
      intro: 'E-mail enviado pelo formulário de contato do site.',
      replyTo: email,
      fields: [
        ['Nome', name],
        ['E-mail', email],
        ['Telefone', phone],
        ['Página', page],
        ['Mensagem', message],
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending contact email:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
