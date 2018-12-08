import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';

dotenv.config();

const emailSenderHelper = (emailToVerify, token) => {
  const noReplyEmail = process.env.NO_REPLY_MAIL;
  const hostUrl = process.env.HOST_URL;
  const sendGridKey = process.env.SENDGRID_API_KEY;

  const url = `${hostUrl}/api/verification/?emailToken=${token}&email=${emailToVerify}`;
  sgMail.setApiKey(sendGridKey);

  const msg = {
    from: `${noReplyEmail}`,
    to: `${emailToVerify}`,
    subject: 'Please verify your email on Authors Haven',
    text: 'You are welcome to Author Haven',
    html: `<strong>Click on the link to verify your email: ${url}</strong>`
  };
  sgMail.send(msg);
};

export default emailSenderHelper;
