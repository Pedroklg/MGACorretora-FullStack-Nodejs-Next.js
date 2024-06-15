import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, subject,phone, message } = req.body;

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
      const emailBody = `Email enviado pelo site.\nEmail enviado: ${email}\nTelefone: ${phone}\nMensagem:\n\n ${message}`;

      // Send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"Contato MGA Corretora" <${process.env.SMTP_USER}>`, // Displayed sender name and address
        to: process.env.RECIPIENT_EMAIL, // Replace with recipient email address
        subject: subject, // Subject line
        text: emailBody, // Plain text body
        html: `<p>${emailBody.replace(/\n/g, '<br>')}</p>`, // HTML body with line breaks converted to <br> tags
      });

      console.log('Message sent: %s', info.messageId);

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
