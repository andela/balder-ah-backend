import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../../src/server';
import { User, Article } from '../../../src/db/models';

import {
  successfulSignup,
  successfulLogin,
  nonExistingEmail,
  incorrectPassword
} from '../../../src/db/seeders/user';
import { loginUser, registerUser } from '../../../src/controllers/users';

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

let request;

const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';

describe('Users Authentication', () => {
  const expectStatusCode = ({ status }, statusCode = 400) =>
    expect(status).to.equal(statusCode);
  const expectErrorMessage = ({ body }, errorMsg) =>
    expect(body)
      .to.have.nested.property('errors.body')
      .that.include(errorMsg);

  before(() => {
    request = chai.request(server).keepOpen();
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
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, email: '' });
      expectStatusCode(response);
      expectErrorMessage(response, 'Please provide email address');
    });

    it('should fail for password length less than 8', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, password: 'abc' });
      expectStatusCode(response);
      expectErrorMessage(
        response,
        'Password must be at least 8 characters long'
      );
    });

    it('should fail for password not being alphanumeric', async () => {
      const response = await request
        .post(signupEndpoint)
        .send({ ...invalidUserData, password: '_abc' });

      expectStatusCode(response);
      expectErrorMessage(
        response,
        'Password should be alphanumeric e.g. abc123'
      );
    });
  });

  describe('Test for user signup', () => {
    it('Should return 201 for success', async () => {
      const response = await request
        .post(signupEndpoint)
        .send(successfulSignup);
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
      const response = await request.post(loginEndpoint).send(successfulLogin);
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
      const response = await request
        .post(loginEndpoint)
        .send(incorrectPassword);
      expect(response).to.have.status(401);
      expect(response.body.message).to.be.a('string');
      expect(response.body.status).to.equal('Fail');
    });

    it('login with remember me checked', async () => {
      const request = {
        body: {
          ...successfulLogin,
          rememberMe: true
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();

      await loginUser(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(200);
    });

    it('fails to generate token for user after login', async () => {
      const request = {
        body: {
          ...successfulLogin
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      delete process.env.TOKEN_SECRET_KEY;
      sinon.stub(response, 'status').returnsThis();

      await loginUser(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });

    it('fails to generate token for user after signup', async () => {
      const request = {
        body: {
          username: 'johnwick',
          email: 'johnwick@wick.com',
          password: 'johnwick'
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      delete process.env.TOKEN_SECRET_KEY;
      sinon.stub(response, 'status').returnsThis();

      await registerUser(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });
});
