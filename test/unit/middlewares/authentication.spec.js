import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import jwt from 'jsonwebtoken';
import { verifyToken, generateToken } from '../../../src/middlewares/authentication';

chai.should();
chai.use(sinonChai);

describe('VerifyUser', () => {
  afterEach(() => sinon.restore());

  const fakePayload = {
    id: 1,
    username: 'johnwick'
  };

  let token = null;

  describe('generateToken()', () => {
    it('should generate a token', () => {
      token = generateToken(fakePayload, { expiresIn: '1hr' });
      expect(token).to.exist;
    });

    it('should verify generated token', () => {
      const request = {
        headers: {
          authorization: token
        }
      };
      const response = {};
      const next = sinon.spy();

      verifyToken(request, response, next);

      expect(next.calledOnce).to.be.true;
    });
  });

  describe('verifyToken()', () => {
    it('verification should fail for no token', () => {
      const request = {
        headers: {
          authorization: ''
        },
        body: {
          token: ''
        }
      };
      const response = {
        status() {},
        json() {}
      };
      const errorMsg = {
        status: 'Fail',
        message: 'No token supplied, please login or signup'
      };

      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon
        .stub(response, 'json')
        .withArgs(errorMsg)
        .returns(errorMsg);

      const verifyTokenResponse = verifyToken(request, response, next);

      expect(response.status).to.have.been.calledWith(403);
      response.json.should.have.been.calledOnce;
      expect(verifyTokenResponse).to.equals(errorMsg);
    });

    it('verification should fail for hardcoded token', () => {
      const request = {
        headers: {
          authorization: `${token}abc`
        }
      };
      const response = {
        status() {},
        json() {}
      };
      const errorMsg = {
        status: 'Fail',
        message: 'Your input is not a JWT token'
      };

      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();
      sinon
        .stub(response, 'json')
        .withArgs(errorMsg)
        .returns(errorMsg);

      const verifyTokenResponse = verifyToken(request, response, next);

      response.status.should.have.been.calledWith(403);
      response.json.should.have.been.calledWith(errorMsg);
      expect(verifyTokenResponse).to.equals(errorMsg);
      expect(next.calledOnce).to.be.false;
    });
    it('error for expired token', () => {
      const expiredToken = jwt.sign(
        { id: 4, username: 'expiredUser' },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: '2s'
        }
      );
      const request = {
        headers: {
          authorization: expiredToken
        }
      };
      const response = {
        status() {}
      };

      const next = sinon.spy();
      sinon.stub(response, 'status').returnsThis();

      // wait 5seconds after token has expired
      setTimeout((done) => {
        verifyToken(request, response, next);
        expect(next.calledOnce).to.be.false;
        response.status.should.have.been.calledWith(403);
        done();
      }, 5000);
    });
  });
});
