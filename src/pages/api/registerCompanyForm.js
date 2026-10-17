import { guardPublicForm } from '@/lib/formGuard';
import { isValidEmail, multiLine, sendFormEmail, singleLine } from '@/lib/mailer';

export default async function handler(req, res) {
  if (!(await guardPublicForm(req, res, { name: 'register', recaptchaAction: 'register' }))) {
    return;
  }

  const body = req.body;
  const data = {
    fullName: singleLine(body.fullName, 120),
    email: singleLine(body.email, 200),
    phone: singleLine(body.phone, 40),
    mobile: singleLine(body.mobile, 40),
    type: singleLine(body.type, 50),
    companyType: singleLine(body.companyType, 100),
    state: singleLine(body.state, 50),
    city: singleLine(body.city, 100),
    district: singleLine(body.district, 100),
    address: singleLine(body.address, 200),
    number: singleLine(body.number, 20),
    complement: singleLine(body.complement, 100),
    description: multiLine(body.description, 5000),
    additionalInfo: multiLine(body.additionalInfo, 5000),
  };

  if (!data.fullName || (!data.email && !data.mobile) || !data.type || !data.state || !data.city || !data.description) {
    return res.status(400).json({ success: false, error: 'Campos obrigatórios ausentes' });
  }

  if (data.email && !isValidEmail(data.email)) {
    return res.status(400).json({ success: false, error: 'E-mail inválido' });
  }

  try {
    await sendFormEmail({
      fromName: 'Cadastro enviado pelo site',
      subject: `[Site] Cadastro de ${data.type}: ${data.fullName}`,
      intro: 'Cadastro enviado pelo formulário "Quero Vender" do site.',
      replyTo: data.email,
      fields: [
        ['Nome completo', data.fullName],
        ['E-mail', data.email],
        ['Telefone', data.phone],
        ['Celular', data.mobile],
        ['Tipo', data.type],
        ['Tipo de empresa', data.companyType],
        ['Estado', data.state],
        ['Cidade', data.city],
        ['Bairro', data.district],
        ['Endereço', data.address],
        ['Número', data.number],
        ['Complemento', data.complement],
        ['Descrição', data.description],
        ['Informações adicionais', data.additionalInfo],
      ],
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending register email:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send email' });
  }
}
