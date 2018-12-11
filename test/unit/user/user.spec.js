import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../../src/server';
import models from '../../../src/db/models';
import { generateToken } from '../../../src/middlewares/authentication';

import {
  nonExistingEmail,
  incorrectPassword,
  successfulSignup,
  loginData,
  removeSeedUsers,
  fakeToken,
  updateProfile,
  incompleteToken,
  noEmailUpdate,
  noUsernameUpdate,
  longBioUpdate,
  undefinedEmail,
  undefinedBio,
  undefinedImage,
  undefinedUsername,
  longUsernameUpdate,
  invalidImageUrl,
  noImageUpdate,
  noBioUpdate,
  undefinedPassword,
  resetPasswordSuccessful,
  resetPasswordWithWrongEmail,
  updatePasswordSuccessfully,
  updateWithWrongPassword,
  emptyResetEmail
} from '../../../src/db/seeders/user';
import { loginUser, registerUser } from '../../../src/controllers/userController';

const { User, Article } = models;
const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

let request;
let jwtSecret;
let resetToken;
const time = { expiresIn: '24hr' };

const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';

describe('Users Authentication', () => {
  const expectStatusCode = ({ status }, statusCode = 400) => expect(status).to.equal(statusCode);
  const expectErrorMessage = ({ body }, errorMsg) => expect(body)
    .to.have.nested.property('errors.body')
    .that.include(errorMsg);

  before(() => {
    request = chai.request(server).keepOpen();
    resetToken = generateToken({ payload: { ...successfulSignup } }, time);
  });

  afterEach(() => {
    sinon.restore();
    process.env.TOKEN_SECRET_KEY = jwtSecret;
  });

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    await Article.destroy({ cascade: true, truncate: true });

    request.close();
  });

  describe('Validate signup', () => {
    const invalidUserData = {
      username: 'johnsnow',
      email: 'johnsnow.mail.com',
      password: 'mysecret'
    };

    it('should fail when username is not provided or empty', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, username: '' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Please provide username');
    });

    it('should fail for invalid email', async () => {
      const response = await request.post(signupEndpoint).send(invalidUserData);
      expectStatusCode(response);
      expectErrorMessage(response, 'Email address is invalid');
    });

    it('should fail when email is not provided or empty', async () => {
      const response = await request.post(signupEndpoint).send({ ...invalidUserData, email: '' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Please provide email address');
    });

    it('should fail for password length less than 8', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, password: 'abc' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Password must be at least 8 characters long');
    });

    it('should fail for password not being alphanumeric', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, password: '' });

      expectStatusCode(response);
      expectErrorMessage(response, 'Password should be alphanumeric e.g. abc123');
    });

    it('should return 400 for undefined password', async () => {
      const response = await request.post(signupEndpoint).send(undefinedPassword);
      expect(response).to.have.status(400);
    });
  });

  describe('Test for user signup', () => {
    it('Should return 201 for success', async () => {
      const response = await request.post(signupEndpoint).send(successfulSignup);
      expect(response).to.have.status(201);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('token');
    });

    it('should fail for existing email', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...successfulSignup, username: 'anonymous' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Email address is already registered');
    });

    it('should fail for existing username', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...successfulSignup, email: 'anonymous@nowhere.com' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Username is already taken');
    });
  });

  describe('Test for user login', () => {
    it('Should return 200 for success', async () => {
      const response = await request.post(loginEndpoint).send(loginData);
      expect(response).to.have.status(200);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('token');
    });
    it('Should return 404 nonExistingEmail', async () => {
      const response = await request.post(loginEndpoint).send(nonExistingEmail);
      expect(response).to.have.status(404);
      expect(response.body.message).to.be.a('string');
      expect(response.body.status).to.equal('Fail');
    });
    it('Should return 401 for incorrect password', async () => {
      const response = await request.post(loginEndpoint).send(incorrectPassword);
      expect(response).to.have.status(401);
      expect(response.body.message).to.be.a('string');
      expect(response.body.status).to.equal('Fail');
    });

    it('login with remember me checked', async () => {
      const newRequest = {
        body: {
          ...loginData,
          rememberMe: true
        }
      };

      const response = {
        status() { },
        send() { },
        json() { }
      };

      sinon.stub(response, 'status').returnsThis();

      await loginUser(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(200);
    });

    it('fails to generate token for user after login', async () => {
      const newRequest = {
        body: {
          ...loginData
        }
      };

      const response = {
        status() { },
        send() { },
        json() { }
      };

      jwtSecret = process.env.TOKEN_SECRET_KEY;
      delete process.env.TOKEN_SECRET_KEY;
      sinon.stub(response, 'status').returnsThis();

      await loginUser(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });

    it('fails to generate token for user after signup', async () => {
      const newRequest = {
        body: {
          username: 'johnwick',
          email: 'johnwick@wick.com',
          password: 'johnwick'
        }
      };

      const response = {
        status() { },
        send() { },
        json() { }
      };

      jwtSecret = process.env.TOKEN_SECRET_KEY;
      delete process.env.TOKEN_SECRET_KEY;
      sinon.stub(response, 'status').returnsThis();
      await registerUser(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });

    it('fake server error when loggin in', async () => {
      const requestObj = {
        body: {
          email: '',
          password: '',
          rememberMe: ''
        }
      };
      const response = {
        status() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();
      sinon.stub(User, 'findOne').throws();
      await loginUser(requestObj, response);

      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('Test for getting current user', () => {
    let userToken = '';
    it('Should return token for success', async () => {
      const response = await request.post(loginEndpoint).send(loginData);
      expect(response.status).to.equal(200);
      userToken = response.body.token;
    });

    it('Should return 200 for success', async () => {
      const response = await chai
        .request(server)
        .get('/api/user')
        .set('authorization', userToken);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('currentUser');
    });

    it('Should return 403 for forbidden user if token is unavailable', async () => {
      const response = await request.get('/api/user');
      expect(response).to.have.status(403);
      expect(response.body.message).to.be.a('string');
    });

    it('Should return 403 for forbidden user if token is invalid', async () => {
      const response = await chai
        .request(server)
        .get('/api/user')
        .set('authorization', fakeToken);
      expect(response).to.have.status(403);
      expect(response.body.message).to.be.a('string');
    });

    it('Should return 403 for forbidden user if token is incomplete', async () => {
      const response = await chai
        .request(server)
        .get('/api/user')
        .set('authorization', incompleteToken);
      expect(response).to.have.status(403);
      expect(response.body.message).to.be.a('string');
    });
  });

  describe('Test for updating user profile', () => {
    let userToken = '';
    before(async () => {
      const response = await chai
        .request(server)
        .post('/api/users/login')
        .send(loginData);
      userToken = response.body.token;
    });
    after(async () => {
      await removeSeedUsers();
    });
    it('Should return 200 for success updating a profile', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(updateProfile);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.a('string');
    });

    it('Should return 400 for empty user email', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(noEmailUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please enter an email');
    });

    it('Should return 400 for empty user bio field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(noBioUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please enter a bio');
    });

    it('Should return 400 for empty user image field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(noImageUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please enter an image url');
    });

    it('Should return 400 for empty username', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(noUsernameUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please enter a username');
    });

    it('Should return 400 for long bio input', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(longBioUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please bio should not be more than 240 characters');
    });

    it('Should return 400 for long username input', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(longUsernameUpdate);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please username should not be more than 100 characters');
    });

    it('Should return 400 for undefined email field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(undefinedEmail);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please add an email field');
    });

    it('Should return 400 for undefined bio field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(undefinedBio);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please add a bio field');
    });

    it('Should return 400 for undefined image field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(undefinedImage);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please add an image field');
    });

    it('Should return 400 for undefined username field', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(undefinedUsername);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please add a username field');
    });

    it('Should return 400 for invalid image url', async () => {
      const response = await chai
        .request(server)
        .put('/api/user')
        .set('authorization', userToken)
        .send(invalidImageUrl);
      expect(response.status).to.equal(400);
      expect(response.body.errors)
        .to.be.an('object')
        .to.have.property('body')
        .to.contain('please enter a valid image URL');
    });
  });
  describe('Test for creating password reset token', () => {
    it('Should return 201 for success', async () => {
      const response = await request.post(signupEndpoint).send(successfulSignup);
      expect(response).to.have.status(201);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('token');
    });
    it('should return 200 for success', async () => {
      const response = await chai.request(server)
        .post('/api/users/resetpassword')
        .send(resetPasswordSuccessful);
      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('Success');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.equal('Password reset link has been sent to your mail');
    });
    it('should return 400 for wrong password reset email', async () => {
      const response = await chai.request(server)
        .post('/api/users/resetpassword')
        .send(resetPasswordWithWrongEmail);
      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.equal('The email does not exist, please sign up.');
    });
    it('should return 400 for empty email field', async () => {
      const response = await chai.request(server)
        .post('/api/users/resetpassword')
        .send(emptyResetEmail);
      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.equal('The email field cannot be empty');
    });
    it('should return 500 when email field is undefined', async () => {
      const response = await chai.request(server)
        .post('/api/users/resetpassword')
        .send();
      expect(response).to.have.status(500);
      expect(response.body.status).to.equal('Error');
    });
  });
  describe('Test for update user password', () => {
    it('should return 200 for success', async () => {
      const response = await chai.request(server)
        .post('/api/users/updatepassword')
        .query({ token: resetToken })
        .send(updatePasswordSuccessfully);
      expect(response).to.have.status(200);
      expect(response.body.status).to.equal('Success');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.equal('Password updated successfully');
    });
    it('should return 400 for mismatching password', async () => {
      updateWithWrongPassword.token = resetToken;
      const response = await chai.request(server)
        .post('/api/users/updatepassword')
        .query({ token: resetToken })
        .send(updateWithWrongPassword);
      expect(response).to.have.status(400);
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.be.a('string');
      expect(response.body.message).to.equal('The passwords do not match, confirm and type again.');
    });
    it('should return 500 when password fields are undefined', async () => {
      const response = await chai.request(server)
        .post('/api/users/updatepassword')
        .query({ token: resetToken })
        .send();
      expect(response).to.have.status(500);
      expect(response.body.status).to.equal('Error');
    });
  });
});
