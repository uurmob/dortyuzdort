import { Resend } from 'resend';

export async function POST(request) {
  const { name, email, message } = await request.json();

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: 'DörtYüzDört <info@dortyuzdort.com>',
      to: 'uurmob@gmail.com',
      subject: `Yeni İletişim: ${name}`,
      html: `
        <h2>Yeni mesaj aldınız</h2>
        <p><strong>Ad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
      `,
      reply_to: email,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Mail gönderilemedi' }, { status: 500 });
  }
}
