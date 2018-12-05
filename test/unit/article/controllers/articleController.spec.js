import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../../src/server';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { User, Article } from '../../../../src/db/models';
import { createArticle } from '../../../../src/db/seeders/articles';
import {
  successfulLogin,
  successfulSignup
} from '../../../../src/db/seeders/user';
import ArticleController from '../../../../src/controllers/article';
import ArticleModel from '../../../../src/helpers/articles';
import { checkUser } from '../../../../src/middlewares/authentication';

chai.use(chaiHttp);
chai.use(sinonChai);

let request;
const articlesEndpoint = '/api/articles';
const loginEndpoint = '/api/users/login';
const signupEndpoint = '/api/users/signup';

describe('Article Controller', () => {
  let newArticle;
  let slug;
  let stubList = [];
  let token;

  before(async () => {
    request = chai.request(server).keepOpen();

    await request.post(signupEndpoint).send(successfulSignup);

    const loginResponnse = await request
      .post(loginEndpoint)
      .send(successfulLogin);
    token = loginResponnse.body.token;

    const result = await request
      .post(articlesEndpoint)
      .set('Authorization', token)
      .send(createArticle);

    newArticle = result.body.newArticle;
    slug = newArticle.slug;
  });

  afterEach(() => {
    stubList.forEach(stub => (stub.restore ? stub.restore() : null));
    stubList = [];
  });

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    await Article.destroy({ cascade: true, truncate: true });

    request.close();
  });

  describe('createArticle', () => {
    it('ecnounter server error creating article', async () => {
      const request = {
        body: { title: 'A nice blog post' },
        userData: { payload: { id: 4000 } }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();

      await ArticleController.createArticle(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('getAllArticles()', () => {
    it('should fail to get all articles', async () => {
      const request = {};
      const response = {
        status: sinon.stub().returnsThis(),
        json: () => {}
      };

      stubList.push(sinon.stub(ArticleModel, 'getAllArticle').returns(false));

      await ArticleController.getAllArticles(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('should throw 500 getting all articles', async () => {
      const request = {};
      const response = {
        status: sinon.stub().returnsThis(),
        json: () => {}
      };

      stubList.push(sinon.stub(ArticleModel, 'getAllArticle').throws());

      await ArticleController.getAllArticles(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('updateArticles()', () => {
    it('should error 404 for invalid slug', async () => {
      const request = {
        params: {
          slug: 11
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      stubList.push(sinon.stub(ArticleModel, 'queryForArticle').returns(false));
      sinon.stub(response, 'status').returnsThis();

      await ArticleController.updateArticle(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('encounter server error updating article', async () => {
      const request = {
        body: {
          title: () => {}
        }
      };

      const response = {
        status() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();

      await ArticleModel.update(request, response, {}, slug);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('getArticle()', () => {
    it('should encounter server error 500', async () => {
      const request = {
        params: {
          slug: 11
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      stubList.push(
        sinon.stub(ArticleModel, 'getOneArticle').throwsException()
      );
      sinon.stub(response, 'status').returnsThis();

      await ArticleController.getArticle(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('deleteArticle()', () => {
    it('should not find article', async () => {
      const request = {
        params: {
          slug: 11
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      stubList.push(sinon.stub(ArticleModel, 'queryForArticle').returns(false));
      sinon.stub(response, 'status').returnsThis();

      await ArticleController.deleteArticle(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('throws error deleting article', async () => {
      const request = {
        params: {
          slug: 11
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      stubList.push(sinon.stub(ArticleModel, 'queryForArticle').returns(true));
      stubList.push(sinon.stub(ArticleModel, 'delete').throws());

      sinon.stub(response, 'status').returnsThis();

      await ArticleController.deleteArticle(request, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('VerifyUser', () => {
    describe('checkUser()', () => {
      it('should check if user is article owner', async () => {
        const request = {
          params: {
            slug
          },
          userData: {
            payload: {
              id: 2000
            }
          }
        };

        const response = {
          status() {},
          json() {}
        };

        sinon.stub(response, 'status').returnsThis();
        const next = sinon.spy();

        await checkUser(request, response, next);

        response.status.should.have.been.calledOnce;
        response.status.should.have.been.calledWith(403);
      });
    });
  });

  describe('ArticleModel', () => {
    it('validates queryForArticle', async () => {
      const result = await ArticleModel.queryForArticle('invalid-slug');
      expect(result).to.be.an('object');
    });
  });
});
