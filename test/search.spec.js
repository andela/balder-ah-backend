import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import { createArticle, createArticle2 } from '../src/db/seeders/articles';
import { firstSearchUserSignup, secondSearchUserSignup } from '../src/db/seeders/user';

const { expect } = chai;

chai.use(chaiHttp);

const signupEndpoint = '/api/users/signup';
const articlesEndpoint = '/api/articles';
let request;
let firstToken;
let firstSlug;
let secondSlug;

describe('Test for Article search', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    request.close();
  });

  describe('Test for Searching for articles by username', () => {
    before(async () => {
      const firstSearch = await request.post(signupEndpoint).send(firstSearchUserSignup);
      firstToken = firstSearch.body.token;
    });
    before(async () => {
      await request.post(signupEndpoint).send(secondSearchUserSignup);
    });

    it('should post a new article', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstToken)
        .send(createArticle);
      // eslint-disable-next-line prefer-destructuring
      firstSlug = response.body.newArticle.slug;

      expect(response.body)
        .to.have.property('message')
        .eql('Article created successfully');
      expect(response.status).to.equal(201);
    });
    it('should post a new article', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstToken)
        .send(createArticle2);
      // eslint-disable-next-line prefer-destructuring
      secondSlug = response.body.newArticle.slug;

      expect(response.body)
        .to.have.property('message')
        .eql('Article created successfully');
      expect(response.status).to.equal(201);
    });

    it('Should filter articles by username', async () => {
      const response = await request.get('/api/search/author/peter');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('Articles found successfully');
    });
    it('Should retrun 404 if there are articles from a particular author', async () => {
      const response = await request.get('/api/search/author/odekwo');
      expect(response).to.have.status(404);
    });
    it('Should return 404 for unknown user', async () => {
      const response = await request.get('/api/search/author/codeshifu');
      expect(response).to.have.status(404);
    });
  });

  describe('Test for Searching for articles by keyword', () => {
    it('Should filter articles by keyword', async () => {
      const response = await request.get('/api/search/article/hot');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('Articles found successfully');
    });
    it('Should return 404 if there are no articles attach to the keyword', async () => {
      const response = await request.get('/api/search/article/bum');
      expect(response).to.have.status(404);
    });
  });

  describe('Test for Searching for articles by tags', () => {
    it('Should filter articles by tags', async () => {
      const response = await request.get('/api/search/tag/andela');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('Articles found successfully');
    });

    it('Should return 404 if there are no articles has the tag', async () => {
      const response = await request.get('/api/search/tag/newdae');
      expect(response).to.have.status(404);
    });

    it('should delete an article', async () => {
      const response = await request
        .delete(`${articlesEndpoint}/${firstSlug}`)
        .set('Authorization', firstToken);
      expect(response.body.status).to.be.equal('Success');
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.deep.equals('Article deleted successfully');
    });

    it('should delete an article', async () => {
      const response = await request
        .delete(`${articlesEndpoint}/${secondSlug}`)
        .set('Authorization', firstToken);
      expect(response.body.status).to.be.equal('Success');
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.deep.equals('Article deleted successfully');
    });
  });
});
