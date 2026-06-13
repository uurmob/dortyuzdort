
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {

  const { name, email, message } = await request.json();

  

  try {

    await resend.emails.send({

      from: 'DörtYüzDört <onboarding@resend.dev>',

      to: 'ugurkiyak@outlook.com',

      subject: `Yeni İletişim: ${name}`,

      html: `

        <h2>Yeni mesaj aldınız</h2>

        <p><strong>Ad:</strong> ${name}</p>

        <p><strong>E-posta:</strong> ${email}</p>

        <p><strong>Mesaj:</strong></p>

        <p>${message}</p>

      `,

    });

    return Response.json({ success: true });

  } catch (error) {

    return Response.json({ error: 'Mail gönderilemedi' }, { status: 500 });

  }

}

