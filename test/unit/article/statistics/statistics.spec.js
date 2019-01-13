import chai, { expect } from 'chai';
import sinon from 'sinon';
import chaiHttp from 'chai-http';
import sinonChai from 'sinon-chai';
import models from '../../../../src/db/models';
import server from '../../../../src/server';
import { successfulSignup, successfulSignup1 } from '../../../../src/db/seeders/user';
import { createArticle } from '../../../../src/db/seeders/articles';

const { User, Article, Statistics: statisticsModel } = models;
const signupEndpoint = '/api/users/signup';
const articlesEndpoint = '/api/articles';

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
let request;
let token;
let secondUserToken;
let slug;
let timeUpdated;
let year;
let month;

describe('Article reading statistics', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  afterEach(() => sinon.restore());

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    await Article.destroy({ cascade: true, truncate: true });
    await statisticsModel.destroy({ cascade: true, truncate: true });

    request.close();
  });

  it('Should signup first user', async () => {
    const response = await request.post(signupEndpoint).send(successfulSignup);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token');

    const { token: loginToken } = response.body;
    token = loginToken;
  });

  it('Should signup second user', async () => {
    const response = await request.post(signupEndpoint).send(successfulSignup1);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('token');

    secondUserToken = response.body.token;
  });

  it('should create an article', async () => {
    const response = await request
      .post(articlesEndpoint)
      .set('Authorization', token)
      .send(createArticle);

    const { newArticle } = response.body;
    const { slug: articleSlug } = newArticle;
    slug = articleSlug;
    timeUpdated = new Date(newArticle.updatedAt).toString().split(' ');
    [month, year] = [timeUpdated[1], timeUpdated[3]];

    expect(response.body)
      .to.have.property('message')
      .eql('Article created successfully');
    expect(response.status).to.equal(201);
  });

  it('should get an article', async () => {
    const response = await request.get(`${articlesEndpoint}/${slug}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('getOneArticle');
  });

  it('should get an article reading stats', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics`)
      .set('Authorization', token);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('lifeTimeReadCount');
  });

  it('should not get an article reading stats', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics`)
      .set('Authorization', secondUserToken);
    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('Sorry, you have no statistics to view at this time');
  });

  it('should not get an article reading stats if year is not specified', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics?month=${month}`)
      .set('Authorization', token);
    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Please specify the year you want to query');
  });

  it('should get an article reading stats for a specific year', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics?year=${year}`)
      .set('Authorization', token);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('annualReadCount');
  });

  it('should get an article reading stats for a specific year and month', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics?year=${year}&month=${month}`)
      .set('Authorization', token);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('monthlyReadCount');
  });

  it('should not get an article reading stats for incorrect year', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics?year=20189`)
      .set('Authorization', token);
    expect(response.status).to.equal(400);
    expect(response.body.errors).to.be.an('object')
      .to.have.property('body')
      .to.contain('Valid year should be a 4 digit integer');
  });

  it('should not get an article reading stats for incorrect month', async () => {
    const response = await request
      .get(`${articlesEndpoint}/${slug}/statistics?year=${year}&month=Dex`)
      .set('Authorization', token);
    expect(response.status).to.equal(400);
    expect(response.body.errors).to.be.an('object')
      .to.have.property('body')
      .to.contain('Valid month should be the first three alphabets of the month');
  });
});
