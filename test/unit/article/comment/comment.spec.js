import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import server from '../../../../src/server';
import Comment from '../../../../src/controllers/comment';
import { successfulSignup } from '../../../../src/db/seeders/user';
import { createArticle } from '../../../../src/db/seeders/articles';
import models from '../../../../src/db/models';

let request;

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

const { User, Article, Comment: CommentModel } = models;
const signupEndpoint = '/api/users/signup';
const articlesEndpoint = '/api/articles';

let token;
let slug;

describe('Comment on article', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  afterEach(() => sinon.restore());

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    await Article.destroy({ cascade: true, truncate: true });
    await CommentModel.destroy({ cascade: true, truncate: true });

    request.close();
  });

  it('Should signup', async () => {
    const response = await request.post(signupEndpoint).send(successfulSignup);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token');

    const { token: loginToken } = response.body;
    token = loginToken;
  });

  it('should create an article', async () => {
    const response = await request
      .post(articlesEndpoint)
      .set('Authorization', token)
      .send(createArticle);

    const { newArticle } = response.body;
    const { slug: articleSlug } = newArticle;
    slug = articleSlug;

    expect(response.body)
      .to.have.property('message')
      .eql('Article created successfully');
    expect(response.status).to.equal(201);
  });

  it('should get all article comments', async () => {
    const response = await request.get(`${articlesEndpoint}/${slug}/comments`);
    expect(response.status).to.equal(200);
  });

  it('should fail to get comment with wrong id', async () => {
    const response = await request.get(`${articlesEndpoint}/${slug}/comments/121212`);
    expect(response.status).to.equal(404);
  });

  it('fail to comment on an article with commentBody', async () => {
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments`)
      .set('Authorization', token)
      .send({});

    expect(response.status).to.equal(400);
  });

  it('should comment on an article', async () => {
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments`)
      .set('Authorization', token)
      .send({ body: 'This is a very nice comment' });

    expect(response.status).to.equal(201);
  });

  it('should get a comment on an article by id', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/comments/1`)
      .set('Authorization', token);
    expect(response.status).to.equal(200);
  });

  it('should like a comment on an article', async () => {
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments/1/reaction`)
      .set('Authorization', token);

    expect(response.status).to.equal(201);
    expect(response.body)
      .to.have.property('message')
      .eql('Comment liked successfully');
    expect(response.body)
      .to.have.property('status')
      .eql('Success');
  });

  it('should unlike a comment on an article', async () => {
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments/1/reaction`)
      .set('Authorization', token);

    expect(response.status).to.equal(200);
    expect(response.body)
      .to.have.property('message')
      .eql('Comment unliked successfully');
  });

  it('fake server error when getting a comment on an article by id', async () => {
    const requestObj = {
      article: {
        getComments: () => {}
      },
      params: { commentId: 1 }
    };
    const response = {
      status() {},
      json() {}
    };
    sinon.stub(requestObj.article, 'getComments').throws();
    sinon.stub(response, 'status').returnsThis();

    await Comment.getOneValidator(requestObj, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('fake unable to post comment ', async () => {
    sinon.stub(CommentModel, 'create').returns(false);
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments`)
      .set('Authorization', token)
      .send({ body: 'This is a very nice comment' });

    expect(response.status).to.equal(500);
  });

  it('fake server error when trying to post comment ', async () => {
    sinon.stub(CommentModel, 'create').throws();
    const response = await request
      .post(`${articlesEndpoint}/${slug}/comments`)
      .set('Authorization', token)
      .send({ body: 'This is a very nice comment' });

    expect(response.status).to.equal(500);
  });

  it('fake server error getting all comments on an article', async () => {
    const requestObj = {
      articles: {
        getComments() {}
      }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(requestObj.articles, 'getComments').throws();
    sinon.stub(response, 'status').returnsThis();

    await Comment.getAll(requestObj, response);

    expect(response.status).to.have.been.calledWith(500);
  });
});
