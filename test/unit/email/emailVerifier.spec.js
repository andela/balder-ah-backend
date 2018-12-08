import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import models from '../../../src/db/models';
import { emailVerifier } from '../../../src/controllers/emailVerifier';

const { User } = models;

const { expect, should } = chai;
should();

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Email Verifier', () => {
  let stubList = [];

  beforeEach(() => {
    stubList.forEach(stub => stub.restore());
    stubList = [];
  });

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

    stubList.push(sinon.stub(response, 'status').returnsThis());
    stubList.push(sinon.stub(User, 'find').returns(false));

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

    stubList.push(sinon.stub(response, 'status').returnsThis());
    stubList.push(sinon.stub(User, 'find').throws());

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

    stubList.push(sinon.stub(response, 'status').returnsThis());
    stubList.push(sinon.stub(User, 'find').returns({ isVerified: true }));

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

    stubList.push(sinon.stub(response, 'status').returnsThis());
    stubList.push(sinon.stub(User, 'find').returns({ email: 'johndoe@mail.com', isVerified: false }));

    stubList.push(sinon.stub(User, 'update').returns(true));

    const result = await emailVerifier(request, response);

    response.status.should.have.been.calledWith(201);
    expect(result).to.have.property('status', 'Success');
    expect(result).to.have.property('message', 'Your email: johndoe@mail.com has been verified');
  });
});
