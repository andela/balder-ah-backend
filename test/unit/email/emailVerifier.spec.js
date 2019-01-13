import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import models from '../../../src/db/models';
import emailVerifier from '../../../src/controllers/emailVerifier';
import { verifyPasswordResetToken } from '../../../src/middlewares/helper';

const { User } = models;

const { expect, should } = chai;
should();

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Email Verifier', () => {
  afterEach(() => sinon.restore());

  it('should not verify an email for invalid user', async () => {
    const request = {
      query: {
        email: 'johndoe@mail.com',
        token: 'notARealToken'
      }
    };

    const response = {
      status() {},
      json(args) {
        return args;
      }
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(User, 'find').returns(false);

    const result = await emailVerifier(request, response);

    response.status.should.have.been.calledWith(404);
    expect(result).to.have.property('status', 'Fail');
    expect(result).to.have.property('message', 'User not found');
  });

  it('should throw a 500 error', async () => {
    const request = {
      query: {
        email: 'johndoe@mail.com',
        token: 'notARealToken'
      }
    };

    const response = {
      status() {},
      json(args) {
        return args;
      }
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(User, 'find').throws();

    const result = await emailVerifier(request, response);

    response.status.should.have.been.calledWith(500);
    expect(result).to.have.property('status', 'Fail');
    expect(result).to.have.property('message', 'Something went wrong');
  });

  it('should not return response for already verified user', async () => {
    const request = {
      query: {
        email: 'johndoe@mail.com',
        token: 'notARealToken'
      }
    };

    const response = {
      status() {},
      json(args) {
        return args;
      }
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(User, 'find').returns({ isVerified: true });

    const result = await emailVerifier(request, response);

    response.status.should.have.been.calledWith(204);
    expect(result).to.have.property('message', 'Email already verified');
  });

  it('should verify user token', async () => {
    const request = {
      query: {
        email: 'johndoe@mail.com',
        token: 'notARealToken'
      }
    };

    const response = {
      status() {},
      json(args) {
        return args;
      }
    };

    sinon.stub(response, 'status').returnsThis();
    sinon.stub(User, 'find').returns({ email: 'johndoe@mail.com', isVerified: false });

    sinon.stub(User, 'update').returns(true);

    const result = await emailVerifier(request, response);

    response.status.should.have.been.calledWith(201);
    expect(result).to.have.property('status', 'Success');
    expect(result).to.have.property('message', 'Your email: johndoe@mail.com has been verified');
  });

  it('should fail to find token for user', async () => {
    const request = {
      query: {
        email: 'johndoe@mail.com',
        token: 'notARealToken'
      }
    };

    const response = {
      status() {},
      json(args) {
        return args;
      }
    };

    sinon.stub(response, 'status').returnsThis();
    sinon
      .stub(User, 'find')
      .onFirstCall()
      .returns({ email: 'johndoe@mail.com', isVerified: false })
      .onSecondCall()
      .returns(false);

    const result = await emailVerifier(request, response);

    expect(result).to.have.property('status', 'Fail');
    expect(result).to.have.property('message', 'Token not found');
  });

  describe('Test verifyPasswordResetToken middleware', () => {
    it('fails for no token', () => {
      const request = { query: { token: '' } };
      const response = {
        status() {},
        json() {}
      };

      const next = sinon.stub();
      sinon.stub(response, 'status').returnsThis();

      verifyPasswordResetToken(request, response, next);
      expect(response.status).to.have.been.calledWith(400);
    });

    it('errors for invalid token', () => {
      const request = { query: { token: 'rubbishToken' } };
      const response = {
        status() {},
        json() {}
      };

      const next = sinon.stub();
      sinon.stub(response, 'status').returnsThis();

      verifyPasswordResetToken(request, response, next);
      expect(response.status).to.have.been.calledWith(400);
    });
  });
});
