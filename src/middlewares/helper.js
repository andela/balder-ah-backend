import sgMail from '@sendgrid/mail';
import { verify } from 'jsonwebtoken';

const { TOKEN_SECRET_KEY } = process.env;
const sendgrid = (toEmail, fromEmail, hostUrl, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const email = {
    from: `${fromEmail}`,
    to: `${toEmail}`,
    subject: 'noreply',
    text: 'Email reset link',
    html: `<a href='#'>follow the link to reset your password${hostUrl}/${token}</a>`
  };
  return sgMail.send(email);
};
const verifyPasswordResetToken = (request, response, next) => {
  const { token } = request.query;
  if (token) {
    verify(token, TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        return response.status(400).json({
          status: 'Fail',
          message: 'The link has expired.',
          error: err,
          userQuery: request.body,
        });
      }
      request.decoded = decoded.payload.payload;
      return next();
    });
  } else {
    response.status(400).json({
      status: 'Fail',
      message: 'You are not authorized to perform this operation, please provide a token.'
    });
  }
};

export { sendgrid, verifyPasswordResetToken };
