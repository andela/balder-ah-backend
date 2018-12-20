import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../../../../src/server';
import models from '../../../../src/db/models';

import {
  successfulSignup,
  loginData,
} from '../../../../src/db/seeders/user';
import { createArticle, createArticle3 } from '../../../../src/db/seeders/articles';
import { getAllTags, getTrendingTags } from '../../../../src/controllers/tagsController';

import tagHelpers from '../../../../src/helpers/tagHelpers';

const { findTags } = tagHelpers;
const { User, Tag, ArticleTags } = models;
const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

let request;
let firstUserToken;

const tagsEndpoint = '/api/tags';
const tredingTagsEndpoint = '/api/tags/trending';
const articlesEndpoint = '/api/articles';
const loginEndpoint = '/api/users/login';

describe('Test for Tags', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    request.close();
  });

  describe('Test for getting all tags', () => {
    before(async () => {
      await User.create(successfulSignup);
      const firstUser = await request.post(loginEndpoint).send(loginData);
      firstUserToken = firstUser.body.token;
      await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(createArticle);
      await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(createArticle3);
    });

    after(async () => {
      await User.truncate({ cascade: true });
      await Tag.truncate({ cascade: true });
      await ArticleTags.truncate({ cascade: true });
    });

    it('should return 200 for getting all tags successfully', async () => {
      const response = await request
        .get(tagsEndpoint);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.deep.equals('Retrieved all tags successfully');
    });

    it('should return 200 for getting all tags successfully', async () => {
      const response = await request
        .get(tredingTagsEndpoint);
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.deep.equals('Retrieved all trending tags successfully');
    });
  });

  describe('Test for not getting any tag', () => {
    it('should return 404 for not getting any tag', async () => {
      const response = await request
        .get(tagsEndpoint);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.be.deep.equals('No tags found');
    });

    it('should return 404 for not getting any trending tag', async () => {
      const response = await request
        .get(tredingTagsEndpoint);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.be.deep.equals('No trending tag found');
    });
  });

  describe('Test for server errors when retrieving tags', () => {
    it('fakes server error when getting all tags', async () => {
      const response = {
        status() { },
        json() { }
      };
      sinon.stub(Tag, 'findAll').throws();
      sinon.stub(response, 'status').returnsThis();
      await getAllTags(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });

    it('fakes server error when getting all trending tags', async () => {
      const response = {
        status() { },
        json() { }
      };
      sinon.stub(ArticleTags, 'findAll').throws();
      sinon.stub(response, 'status').returnsThis();
      await getTrendingTags(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });

    it('fakes throw an error when finding all trending tags', async () => {
      const topTags = 'xx.xxxcxxxxxz.r';
      const response = await findTags(topTags);
      expect(response).to.be.a('string');
    });
  });
});
