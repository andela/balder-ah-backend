import sgMail from '@sendgrid/mail';
import { verify } from 'jsonwebtoken';
import models from '../db/models';
import errorResponse from '../helpers';

const { User } = models;

const { TOKEN_SECRET_KEY } = process.env;
const sendgrid = (toEmail, fromEmail, hostUrl, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const email = {
    from: `${fromEmail}`,
    to: `${toEmail}`,
    subject: 'noreply',
    text: 'Email reset link',
    html: `<a href=${hostUrl}/${token}>Click here to reset your password</a>`
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
      message: 'You are not authorised to perform this operation, please provide a token.'
    });
  }
};

const validateInput = (request, response, next) => {
  const { text, comment } = request.body;
  if (text.trim().length < 1 || comment.trim().length < 1) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Text and comment fields must not be empty'
    });
  }
  return next();
};

const verifyUserStatus = (request, response, next) => {
  const { role } = request.userData.payload;
  if (role !== 'superAdmin') {
    return response.status(403).json({
      status: 'Fail',
      message: 'You are not authorised to perform this operation'
    });
  }
  return next();
};

const validateUpdateInputs = (request, response, next) => {
  const { email, role } = request.body;
  if (!email || !email.trim()) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Email field is required'
    });
  }
  if (!role || !role.trim()) {
    return response.status(400).json({
      status: 'Fail',
      message: 'Role field is required'
    });
  }
  return next();
};

const verifyAdminOrSuperAdmin = (request, response, next) => {
  const { role } = request.userData.payload;
  if (role === 'superAdmin' || role === 'admin') {
    return next();
  }
  return response.status(403).json({
    status: 'Fail',
    message: 'You are not authorised to perform this operation'
  });
};

const findOneUser = async (request, response, next) => {
  const { email } = request.body;
  try {
    const result = await User.findOne({
      where: {
        email,
      }
    });
    if (!result) {
      return response.status(404).json({
        status: 'Fail',
        message: 'User does not exist'
      });
    }
    return next();
  } catch (error) {
    response.status(500).json({
      status: 'Fail',
      message: errorResponse(['internal server error, please try again later']),
    });
  }
};
export {
  sendgrid,
  verifyPasswordResetToken,
  validateInput,
  verifyUserStatus,
  validateUpdateInputs,
  verifyAdminOrSuperAdmin,
  findOneUser
};
