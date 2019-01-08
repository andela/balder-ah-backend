import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import Models from '../src/db/models';
import { firstBookmarkSignup, secondBookmarkSignup } from '../src/db/seeders/user';
import { createArticle } from '../src/db/seeders/articles';

const { User } = Models;

const { expect } = chai;

chai.use(chaiHttp);

const signupEndpoint = '/api/users/signup';
const articlesEndpoint = '/api/articles';
let request;
let firstUserToken;
let secondUserToken;
let slug;

describe('Test for follows', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    request.close();
  });

  describe('Test for bookmark', () => {
    before(async () => {
      const firstUser = await request.post(signupEndpoint).send(firstBookmarkSignup);
      firstUserToken = firstUser.body.token;
    });
    before(async () => {
      const secondUser = await request.post(signupEndpoint).send(secondBookmarkSignup);
      secondUserToken = secondUser.body.token;
    });

    it('should post a new article', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(createArticle);
      // eslint-disable-next-line prefer-destructuring
      slug = response.body.newArticle.slug;
      expect(response.body)
        .to.have.property('message')
        .eql('Article created successfully');
      expect(response.status).to.equal(201);
    });
    it('should allow user bookmark an article', async () => {
      const response = await request
        .post(`${articlesEndpoint}/${slug}/bookmarks`)
        .set('Authorization', firstUserToken);
      expect(response.body)
        .to.have.property('message')
        .eql('Article successfully bookmarked');
      expect(response.status).to.equal(200);
    });
    it('should return 400 when a user tries to bookmark an already bookmarked article', async () => {
      const response = await request
        .post(`${articlesEndpoint}/${slug}/bookmarks`)
        .set('Authorization', firstUserToken);
      expect(response.status).to.equal(400);
    });
    it('should return 500 when a user tries to bookmark an unknown article', async () => {
      const response = await request
        .post(`${articlesEndpoint}/The-chum-chum-of4555555955/bookmarks`)
        .set('Authorization', firstUserToken);
      expect(response.status).to.equal(500);
    });
    it("should get a user's bookmarks", async () => {
      const response = await request
        .get('/api/user/bookmarks')
        .set('Authorization', firstUserToken);
      expect(response.body)
        .to.have.property('message')
        .eql('All bookmarks retrieved');
      expect(response.status).to.equal(200);
    });
    it("should return 404 if a user's bookmark is empty", async () => {
      const response = await request
        .get('/api/user/bookmarks')
        .set('Authorization', secondUserToken);
      expect(response.body)
        .to.have.property('message')
        .eql('No bookmark available');
      expect(response.status).to.equal(404);
    });
    it('should return 404 for bookmark not found before delete', async () => {
      const response = await request
        .delete('/api/user/bookmarks/50')
        .set('Authorization', firstUserToken);
      expect(response.status).to.equal(404);
      expect(response.body)
        .to.have.property('message')
        .eql('No bookmark found');
    });
    it("should not allow a user remove another user' bookmark", async () => {
      const response = await request
        .delete('/api/user/bookmarks/1')
        .set('Authorization', secondUserToken);
      expect(response.status).to.equal(403);
      expect(response.body)
        .to.have.property('message')
        .eql('You are not allowed to perform this action');
    });
    it("should remove a user's bookmark successfully", async () => {
      const response = await request
        .delete('/api/user/bookmarks/1')
        .set('Authorization', firstUserToken);
      expect(response.status).to.equal(202);
      expect(response.body)
        .to.have.property('message')
        .eql('Bookmark removed successfully');
    });
    it('should remove return error for invalid bookmark Id', async () => {
      const response = await request
        .delete('/api/user/bookmarks/hvur48ef')
        .set('Authorization', firstUserToken);
      expect(response.status).to.equal(400);
    });
    it('should delete an article', async () => {
      const response = await request
        .delete(`${articlesEndpoint}/${slug}`)
        .set('Authorization', firstUserToken);
      expect(response.body.status).to.be.equal('Success');
      expect(response.status).to.equal(200);
      expect(response.body.message).to.be.deep.equals('Article deleted successfully');
    });
  });
});
