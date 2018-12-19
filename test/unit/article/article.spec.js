import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../src/server';
import models from '../../../src/db/models';

import {
  successfulSignup,
  successfulSignup2,
  loginData,
  successfulLogin2
} from '../../../src/db/seeders/user';

import {
  createArticle,
  updateArticle,
  inCompleteArticle,
  badTitle,
  badDescription,
  rate2,
  rate4,
  rate5,
  rate6,
  emptyRating,
  noTagsArticle,
  wrongTagsInputArticle,
  emptyStringTagsInput
} from '../../../src/db/seeders/articles';

const { User, Article } = models;
const { expect } = chai;

chai.use(chaiHttp);

let firstUserToken;
let secondUserToken;
let slug;
let secondSlug;

let request;

const articlesEndpoint = '/api/articles';
const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';

describe('Test for article', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    await Article.destroy({ cascade: true, truncate: true });

    request.close();
  });

  describe('Test for user signup', () => {
    it('Should return 201 for success', async () => {
      const response = await request.post(signupEndpoint).send(successfulSignup);

      expect(response).to.have.status(201);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('token');
    });

    it('Should return 201 for success', async () => {
      const response = await request.post(signupEndpoint).send(successfulSignup2);

      expect(response).to.have.status(201);
      expect(response.body.message).to.be.a('string');
      expect(response.body).to.have.property('token');
    });
  });

  describe('Test for no articles', () => {
    it('should return empty array when page contains no article', async () => {
      const response = await request.get(articlesEndpoint);
      expect(response.redirects).to.have.length('0');
      expect(response.body.message).to.equal('No article found');
    });

    before(async () => {
      const secondUser = await request.post(loginEndpoint).send(successfulLogin2);
      secondUserToken = secondUser.body.token;
    });
  });

  describe('Test for creating articles', () => {
    before(async () => {
      const firstUser = await request.post(loginEndpoint).send(loginData);
      firstUserToken = firstUser.body.token;
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
      expect(response.body.newArticle.readtime).to.be.equal('4 mins');
    });

    it('should post a new article', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(createArticle);
      // eslint-disable-next-line prefer-destructuring
      secondSlug = response.body.newArticle.slug;

      expect(response.body)
        .to.have.property('message')
        .eql('Article created successfully');
      expect(response.status).to.equal(201);
      expect(response.body.newArticle.readtime).to.be.equal('4 mins');
    });

    it('should not post a new article with low title length', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(badTitle);

      expect(response.body)
        .to.have.property('message')
        .eql('Please enter characters between 3 and 50');
      expect(response.status).to.equal(400);
    });

    it('should not post a new article with low description length', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(badDescription);

      expect(response.body)
        .to.have.property('message')
        .eql('Please enter characters between 5 and 100');
      expect(response.status).to.equal(400);
    });

    it('should not post a new article with an unknown user', async () => {
      const response = await request
        .post(`${articlesEndpoint}/`)
        .set('Authorization', 'afhufh842rfefefuehuefe')
        .send(createArticle);

      expect(response.status).to.equal(403);
    });

    it('should not post an article with empty input fields', async () => {
      const response = await request
        .post(articlesEndpoint)
        .set('Authorization', firstUserToken)
        .send(inCompleteArticle);

      expect(response.body.status).to.be.equal('Fail');
      expect(response.status).to.equal(400);
      expect(response.body.message).to.be.deep.equals('All fields are required');
    });

    describe('tests for article ratings', () => {
      it('should rate an article', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${slug}/rating`)
          .set('Authorization', firstUserToken)
          .send(rate2);

        expect(response.status).to.equal(201);
        expect(response.body.message).to.be.deep.equals('Rating recorded successfully');
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('result');
        expect(response.body.result).to.have.property('rating');
        expect(response.body.result.rating).to.be.deep.equals('2');
      });
      it('should rate an article', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${slug}/rating`)
          .set('Authorization', firstUserToken)
          .send(rate4);

        expect(response.status).to.equal(201);
        expect(response.body.message).to.be.deep.equals('Rating recorded successfully');
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('result');
        expect(response.body.result).to.have.property('rating');
        expect(response.body.result.rating).to.be.deep.equals('4');
      });

      it('should rate an article', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${slug}/rating`)
          .set('Authorization', firstUserToken)
          .send(rate5);

        expect(response.status).to.equal(201);
        expect(response.body.message).to.be.deep.equals('Rating recorded successfully');
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('result');
        expect(response.body.result).to.have.property('rating');
        expect(response.body.result.rating).to.be.deep.equals('5');
      });

      it('should get average rating on an article', async () => {
        const articleRatingStar = (Number(rate2.rating)
          + Number(rate4.rating) + Number(rate5.rating)) / 3;
        const response = await request
          .get(`${articlesEndpoint}/${slug}`)
          .set('Authorization', firstUserToken);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('getOneArticle');
        expect(response.body.getOneArticle.articleRatingStar)
          .to.be.deep.equals(articleRatingStar.toFixed(1));
      });

      it('should rate an article', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${secondSlug}/rating`)
          .set('Authorization', firstUserToken)
          .send(rate5);

        expect(response.status).to.equal(201);
        expect(response.body.message).to.be.deep.equals('Rating recorded successfully');
        expect(response.body).to.be.a('object');
        expect(response.body).to.have.property('result');
        expect(response.body.result).to.have.property('rating');
        expect(response.body.result.rating).to.be.deep.equals('5');
      });

      it('should fail for undefined and empty rating', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${slug}/rating`)
          .set('Authorization', firstUserToken)
          .send(emptyRating);

        expect(response.status).to.equal(400);
        expect(response.body.errors).to.be.an('object')
          .to.have.property('body')
          .to.contain('please add a rating parameter');
      });

      it('should fail for rating beyond 5 or non-integer', async () => {
        const response = await request
          .post(`${articlesEndpoint}/${slug}/rating`)
          .set('Authorization', firstUserToken)
          .send(rate6);
        expect(response.status).to.equal(400);
        expect(response.body.errors).to.be.an('object')
          .to.have.property('body')
          .to.contain('rating should be a positive integer between 1 to 5');
      });

      it('Should return 200 for success if authorRating is included in response', async () => {
        const response = await chai
          .request(server)
          .get('/api/user')
          .set('authorization', firstUserToken);
        expect(response.status).to.equal(200);
        expect(response.body.message).to.be.a('string');
        expect(response.body).to.have.property('currentUser');
        expect(response.body.currentUser).to.have.property('authorRating');
        expect(response.body.currentUser.authorRating).to.equal('4.0');
      });

      it('should not post an article without a tags field', async () => {
        const response = await request
          .post(articlesEndpoint)
          .set('Authorization', firstUserToken)
          .send(noTagsArticle);
        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.deep.equals('Please add a tags field');
      });

      it('should not post an article with a wrong type of tags input', async () => {
        const response = await request
          .post(articlesEndpoint)
          .set('Authorization', firstUserToken)
          .send(wrongTagsInputArticle);
        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.deep.equals('Please tags should be an array of tags');
      });
      it('should not post an article with empty string of tags', async () => {
        const response = await request
          .post(articlesEndpoint)
          .set('Authorization', firstUserToken)
          .send(emptyStringTagsInput);
        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.deep.equals('Please all tags should be strings');
      });

      it('should not post an article with empty string of tags', async () => {
        const response = await request
          .post(articlesEndpoint)
          .set('Authorization', firstUserToken)
          .send(emptyStringTagsInput);
        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(400);
        expect(response.body.message).to.be.deep.equals('Please all tags should be strings');
      });

      it('should not get articles when page is not a number', async () => {
        const response = await request.get(articlesEndpoint).query({ page: 'were' });
        expect(response.status).to.equal(400);
        expect(response.body.errors.body[0]).to.be.equal('Page can only be numbers');
      });
      it('should not get articles when page number is less than 1', async () => {
        const response = await request.get(articlesEndpoint).query({ page: -1 });
        expect(response.status).to.equal(400);
        expect(response.body.errors.body[0]).to.be.equal('Page number must be 1 or greater than 1');
      });
    });

    describe('Test for get articles', () => {
      before(async () => {
        const secondUser = await request.post(loginEndpoint).send(successfulLogin2);
        secondUserToken = secondUser.body.token;
      });
      it('should get all articles', async () => {
        const response = await request.get(articlesEndpoint);
        expect(response.body.status).to.be.equal('Success');
        expect(response.body.message).to.be.deep.equals('All articles found successfully');
      });

      it('should get one article', async () => {
        const response = await request
          .get(`${articlesEndpoint}/${slug}`)
          .set('Authorization', secondUserToken);
        expect(response.body.status).to.be.equal('Success');
        expect(response.status).to.equal(200);
        expect(response.body.message).to.be.deep.equals('Article found successfully');
        expect(response.body.getOneArticle.readtime).to.be.equal('4 mins');
      });

      it('should not get an unknown article', async () => {
        const response = await request
          .get(`${articlesEndpoint}/biro-jdfap-nvs-12344532`)
          .set('Authorization', secondUserToken);

        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(404);
        expect(response.body.message).to.be.deep.equals('Article not found');
      });
    });

    describe('Test for updating articles', () => {
      before(async () => {
        const firstUser = await request.post(loginEndpoint).send(loginData);
        firstUserToken = firstUser.body.token;
      });

      before(async () => {
        const secondUser = await request.post(loginEndpoint).send(successfulLogin2);
        secondUserToken = secondUser.body.token;
      });

      it('should update an article', async () => {
        const response = await request
          .put(`${articlesEndpoint}/${slug}`)
          .set('Authorization', firstUserToken)
          .send(updateArticle);
        expect(response.body.status).to.be.equal('Success');
        expect(response.body.message).to.be.deep.equals('Article has been updated successfully');
        expect(response.body.updatedArticle.readtime).to.be.equal('2 mins');
      });

      it('should not update an unknown article', async () => {
        const response = await request
          .put(`${articlesEndpoint}/hfd-fdfd-vwdcas-325525`)
          .set('Authorization', firstUserToken)
          .send(updateArticle);

        expect(response.body.status).to.be.equal('Fail');
        expect(response.body.message).to.be.deep.equals('Article not found');
      });

      it("should not allow a user to update another user's article", async () => {
        const response = await request
          .put(`${articlesEndpoint}/hfd-fdfd-vwdcas-325525`)
          .set('Authorization', secondUserToken)
          .send(updateArticle);

        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(404);
        expect(response.body.message).to.be.deep.equals('Article not found');
      });
    });

    describe('Test for deleting articles', () => {
      before(async () => {
        const firstUser = await request.post(loginEndpoint).send(loginData);
        firstUserToken = firstUser.body.token;
      });

      before(async () => {
        const secondUser = await request.post(loginEndpoint).send(successfulLogin2);
        secondUserToken = secondUser.body.token;
      });

      it('should delete an article', async () => {
        const response = await request
          .delete(`${articlesEndpoint}/${slug}`)
          .set('Authorization', firstUserToken);
        expect(response.body.status).to.be.equal('Success');
        expect(response.status).to.equal(200);
        expect(response.body.message).to.be.deep.equals('Article deleted successfully');
      });

      it('should not delete an article', async () => {
        const response = await request
          .delete(`${articlesEndpoint}/${secondSlug}`)
          .set('Authorization', 'jdkfdjkfdkf');

        expect(response.status).to.equal(403);
      });

      it('should not delete an unknown article', async () => {
        const response = await request
          .delete(`${articlesEndpoint}/hfd-fdfd-vwdcas-325525`)
          .set('Authorization', firstUserToken);

        expect(response.body.status).to.be.equal('Fail');
        expect(response.status).to.equal(404);
        expect(response.body.message).to.be.deep.equals('Article not found');
      });
    });
  });
});
