import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import app from '../../../src/server';
import { createArticle } from '../../../src/db/seeders/articles';
import FavoriteArticleController from '../../../src/controllers/favoriteArticleController';
import FavoriteModelHelper from '../../../src/helpers/favorite';

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

describe('Test for favoriting articles', () => {
  const data = {};
  before(async () => {
    const response = await chai.request(app)
      .post('/api/users/signup')
      .send({
        email: 'kay@gmail.com',
        username: 'kay',
        password: 'kay4andela'
      });

    data.token = response.body.token;
    const response2 = await chai.request(app)
      .post('/api/articles')
      .set('Authorization', data.token)
      .send(createArticle);
    data.articleSlug = response2.body.newArticle.slug;
  });

  it('should favorite an article', async () => {
    const response = await chai.request(app)
      .post(`/api/articles/${data.articleSlug}/favorite`)
      .set('Authorization', data.token);

    expect(response.status).to.eql(200);
    expect(response.body).to.have.property('getOneArticle');
    expect(response.body.getOneArticle.favoritesCount).to.eql(1);
    expect(response.body.getOneArticle.favorited).to.eql(true);
  });

  it('should unfavorite an article', async () => {
    const response = await chai.request(app)
      .del(`/api/articles/${data.articleSlug}/favorite`)
      .set('Authorization', data.token);

    expect(response.status).to.eql(200);
    expect(response.body).to.have.property('getOneArticle');
    expect(response.body.getOneArticle.favoritesCount).to.eql(0);
    expect(response.body.getOneArticle.favorited).to.eql(false);
  });

  it('should not favorite an article if unauthenticated', async () => {
    const response = await chai.request(app)
      .post(`/api/articles/${data.articleSlug}/favorite`);

    expect(response.status).to.eql(403);
    expect(response.body.status).to.have.eql('Fail');
  });

  it('should not unfavorite an article if unauthenticated', async () => {
    const response = await chai.request(app)
      .del(`/api/articles/${data.articleSlug}/favorite`);

    expect(response.status).to.eql(403);
    expect(response.body.status).to.have.eql('Fail');
  });

  it('should show favorites count even if user is authenticated', async () => {
    const response = await chai.request(app)
      .get(`/api/articles/${data.articleSlug}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.have.property('getOneArticle');
    expect(response.body.getOneArticle).to.have.property('favorited');
    expect(response.body.getOneArticle).to.have.property('favoritesCount');
  });

  it('should fake 500 error for favoriting article', async () => {
    const request = { userData: { payload: { id: 1 } }, params: { slug: 'some-article' } };
    const response = { status() {}, json() {} };

    sinon.stub(FavoriteModelHelper, 'favoriteArticle').throws();
    sinon.stub(response, 'status').returnsThis();

    await FavoriteArticleController.favoriteArticle(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('should fake 500 error for unfavoriting article', async () => {
    const request = { userData: { payload: { id: 1 } }, params: { slug: 'some-article' } };
    const response = { status() {}, json() {} };

    sinon.stub(FavoriteModelHelper, 'unfavoriteArticle').throws();
    sinon.stub(response, 'status').returnsThis();

    await FavoriteArticleController.unfavoriteArticle(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });
});
