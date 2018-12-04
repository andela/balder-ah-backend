import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../../../src/server';
import models from '../../../../src/db/models';
import { createArticle } from '../../../../src/db/seeders/articles';
import { loginData, successfulSignup } from '../../../../src/db/seeders/user';
import ArticleController from '../../../../src/controllers/article';
import ArticleModel from '../../../../src/helpers/articles';
import { checkUser } from '../../../../src/middlewares/authentication';

chai.use(chaiHttp);
chai.use(sinonChai);

let request;
const { User, Article } = models;
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

    const loginResponnse = await request.post(loginEndpoint).send(loginData);
    const { body: responseBody } = loginResponnse;
    const { token: responseToken } = responseBody;

    token = responseToken;

    const createArticleResponse = await request
      .post(articlesEndpoint)
      .set('Authorization', token)
      .send(createArticle);

    const { body: newArticleResponse } = createArticleResponse;
    const { newArticle: createdArticle } = newArticleResponse;

    newArticle = createdArticle;
    const { slug: articleSlug } = newArticle;
    slug = articleSlug;
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
      const newRequest = {
        body: { title: 'A nice blog post' },
        userData: { payload: { id: 4000 } }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();

      await ArticleController.createArticle(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('getAllArticles()', () => {
    it('should fail to get all articles', async () => {
      const newRequest = {};
      const response = {
        status: sinon.stub().returnsThis(),
        json: () => {}
      };

      stubList.push(sinon.stub(ArticleModel, 'getAllArticle').returns(false));

      await ArticleController.getAllArticles(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('should throw 500 getting all articles', async () => {
      const newRequest = {};
      const response = {
        status: sinon.stub().returnsThis(),
        json: () => {}
      };

      stubList.push(sinon.stub(ArticleModel, 'getAllArticle').throws());

      await ArticleController.getAllArticles(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('updateArticles()', () => {
    it('should error 404 for invalid slug', async () => {
      const newRequest = {
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

      await ArticleController.updateArticle(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('encounter server error updating article', async () => {
      const newRequest = {
        body: {
          title: () => {}
        }
      };

      const response = {
        status() {},
        json() {}
      };

      sinon.stub(response, 'status').returnsThis();

      await ArticleModel.update(newRequest, response, {}, slug);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('getArticle()', () => {
    it('should encounter server error 500', async () => {
      const newRequest = {
        params: {
          slug: 11
        }
      };

      const response = {
        status() {},
        send() {},
        json() {}
      };

      stubList.push(sinon.stub(ArticleModel, 'getOneArticle').throwsException());
      sinon.stub(response, 'status').returnsThis();

      await ArticleController.getArticle(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('deleteArticle()', () => {
    it('should not find article', async () => {
      const newRequest = {
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

      await ArticleController.deleteArticle(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(404);
    });

    it('throws error deleting article', async () => {
      const newRequest = {
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

      await ArticleController.deleteArticle(newRequest, response);

      response.status.should.have.been.calledOnce;
      response.status.should.have.been.calledWith(500);
    });
  });

  describe('VerifyUser', () => {
    describe('checkUser()', () => {
      it('should check if user is article owner', async () => {
        const newRequest = {
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

        await checkUser(newRequest, response, next);

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
