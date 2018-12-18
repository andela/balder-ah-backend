import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../../../../src/db/models';
import server from '../../../../src/server';
import { successfulSignup3 } from '../../../../src/db/seeders/user';

import { createArticle } from '../../../../src/db/seeders/articles';

const { expect } = chai;
const { HighlightedText } = models;

chai.use(chaiHttp);

let request;

const signupEndpoint = '/api/users/signup';
const articlesEndpoint = '/api/articles';

describe('Test for article', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    await HighlightedText.destroy({ cascade: true, truncate: true });
    request.close();
  });
  describe('Test for highlighting article', () => {
    let user;
    let article;
    let userToken;
    let articleslSlug;
    before(async () => {
      user = await request.post(signupEndpoint).send(successfulSignup3);
      userToken = user.body.token;
      article = await request.post(articlesEndpoint).set('Authorization', userToken).send(createArticle);
      articleslSlug = article.body.newArticle.slug;
    });
    it('should return 201 for successfull comment on a highlighted test', async () => {
      const payLoad = {
        text: 'work assigned',
        comment: 'indeed'
      };
      const response = await request.post(`${articlesEndpoint}/${articleslSlug}/comments/highlight-text`)
        .set('Authorization', userToken)
        .send(payLoad);
      expect(response).to.have.status(201);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.equal('Success');
      expect(response.body.message).to.equal('Comment created successfully');
    });
    it('should return 404 for highlighted text that is not part of an article', async () => {
      const payLoad = {
        text: 'he comes finally',
        comment: 'Indeed'
      };
      const response = await request.post(`${articlesEndpoint}/${articleslSlug}/comments/highlight-text`)
        .set('Authorization', userToken)
        .send(payLoad);
      expect(response).to.have.status(404);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.equal('Article does not contain the highlighted text');
    });
    it('should return 400 for empty text or comment field', async () => {
      const payLoad = {
        text: '',
        comment: ''
      };
      const response = await request.post(`${articlesEndpoint}/${articleslSlug}/comments/highlight-text`)
        .set('Authorization', userToken)
        .send(payLoad);
      expect(response).to.have.status(400);
      expect(response.body).to.be.an('object');
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.equal('Text and comment fields must not be empty');
    });
  });
});
