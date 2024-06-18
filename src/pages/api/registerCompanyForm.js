import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const {
      fullName,
      email,
      subject = 'Cadastro',
      phone,
      mobile,
      type,
      state,
      city,
      district,
      number,
      address,
      companyType,
      complement,
      description,
      additionalInfo
    } = req.body;

    try {
      // Create a transporter
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Construct email body text
      const emailBody = `
        Nome Completo: ${fullName}
        Email: ${email}
        Telefone: ${phone}
        Celular: ${mobile}
        Tipo: ${type}
        Tipo de Empresa: ${companyType}
        Estado: ${state}
        Cidade: ${city}
        Bairro: ${district}
        Número: ${number}
        Endereço: ${address}
        Complemento: ${complement}
        Descrição: ${description}
        Informações Adicionais: ${additionalInfo}
      `;

      // Send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Cadastro enviado pelo site" <${process.env.SMTP_USER}>`,
        to: process.env.RECIPIENT_EMAIL,
        subject: subject,
        text: emailBody,
        html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to send email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}