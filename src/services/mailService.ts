import nodemailer from 'nodemailer';

const mailService = {
  sendEmail: async (email: string, url: string, token: string) => {
    if (process.env.NODE_ENV === 'production') {
      // send real email
    }

    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    const mail = await transporter.sendMail({
      from: 'TRPC blog with Next.js',
      to: email,
      subject: 'Login to your account',
      html: `Login by clicking <a href="${url}/login#token=${token}">here</a>`,
    });

    // eslint-disable-next-line no-console
    console.info('Message sent: %s', nodemailer.getTestMessageUrl(mail));
  },
};

export default mailService;
