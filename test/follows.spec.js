import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

import {
  firstUserSignup,
  firstUserLogin,
  secondUserSignup,
  secondUserLogin,
  thirdUserSignup,
  thirdUserLogin,
  fourthUserSignup
} from '../src/db/seeders/user';

const { expect } = chai;

chai.use(chaiHttp);

const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';
let request;
let firstUserToken;
let secondUserToken;
let thirdUserToken;
let fourthUserToken;

describe('Test for follows', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(async () => {
    request.close();
  });

  describe('Test for following a user', () => {
    before(async () => {
      const firstUser = await request.post(signupEndpoint).send(firstUserSignup);
      firstUserToken = firstUser.body.token;
    });
    before(async () => {
      const secondUser = await request.post(signupEndpoint).send(secondUserSignup);
      secondUserToken = secondUser.body.token;
    });
    before(async () => {
      const thirdUser = await request.post(signupEndpoint).send(thirdUserSignup);
      thirdUserToken = thirdUser.body.token;
    });

    it('Should allow a user follow another user', async () => {
      const response = await request
        .post('/api/profiles/ogidan/follow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You are now following ogidan');
    });
    it('Should allow user follow another user', async () => {
      const response = await request
        .post('/api/profiles/emkay/follow')
        .set('Authorization', secondUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You are now following emkay');
    });
    it('Should allow user follow another user', async () => {
      const response = await request
        .post('/api/profiles/ogidan/follow')
        .set('Authorization', thirdUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You are now following ogidan');
    });
    it('Should not allow a user follow another user multiple times', async () => {
      const response = await request
        .post('/api/profiles/ogidan/follow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(409);
    });
    it('Should not allow a user follow themself', async () => {
      const response = await request
        .post('/api/profiles/emkay/follow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(409);
    });
    it('Should not allow a user follow an unknown user', async () => {
      const response = await request
        .post('/api/profiles/fibonacci/follow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(404);
    });
  });

  describe('Test for all following', () => {
    before(async () => {
      const firstUser = await request.post(loginEndpoint).send(firstUserLogin);
      firstUserToken = firstUser.body.token;
    });
    before(async () => {
      const secondUser = await request.post(loginEndpoint).send(secondUserLogin);
      secondUserToken = secondUser.body.token;
    });
    before(async () => {
      const thirdUser = await request.post(loginEndpoint).send(thirdUserLogin);
      thirdUserToken = thirdUser.body.token;
    });
    before(async () => {
      const fourthUser = await request.post(signupEndpoint).send(fourthUserSignup);
      fourthUserToken = fourthUser.body.token;
    });

    it('Should get all users that is following a particular user', async () => {
      const response = await request
        .get('/api/profiles/ogidan/followings')
        .set('Authorization', secondUserToken);
      expect(response).to.have.status(200);
      expect(response.body.following).to.be.an('array');
    });
    it('Should not get non-existing followings', async () => {
      const response = await request
        .get('/api/profiles/okoro/followings')
        .set('Authorization', fourthUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You are not following any user');
    });
    it('Should not get non-existing followings for an unknown user', async () => {
      const response = await request
        .get('/api/profiles/foolish/followings')
        .set('Authorization', fourthUserToken);
      expect(response).to.have.status(404);
    });

    it('Should get all users that a particular user follows', async () => {
      const response = await request
        .get('/api/profiles/ogidan/followers')
        .set('Authorization', secondUserToken);
      expect(response).to.have.status(200);
      expect(response.body.follower).to.be.an('array');
    });
    it('Should not get non-existing followers', async () => {
      const response = await request
        .get('/api/profiles/okoro/followers')
        .set('Authorization', fourthUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You have no follower');
    });
    it('Should not get non-existing followings for an unknown user', async () => {
      const response = await request
        .get('/api/profiles/foolish/followers')
        .set('Authorization', fourthUserToken);
      expect(response).to.have.status(404);
    });
  });

  describe('Test for unfollowing a user', () => {
    before(async () => {
      const firstUser = await request.post(loginEndpoint).send(firstUserLogin);
      firstUserToken = firstUser.body.token;
    });
    before(async () => {
      const secondUser = await request.post(loginEndpoint).send(secondUserLogin);
      secondUserToken = secondUser.body.token;
    });
    before(async () => {
      const thirdUser = await request.post(loginEndpoint).send(thirdUserLogin);
      thirdUserToken = thirdUser.body.token;
    });

    it('Should allow a user unfollow another user', async () => {
      const response = await request
        .delete('/api/profiles/ogidan/unfollow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You have Unfollowed ogidan');
    });
    it('Should allow user follow another user', async () => {
      const response = await request
        .delete('/api/profiles/emkay/unfollow')
        .set('Authorization', secondUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You have Unfollowed emkay');
    });
    it('Should allow user follow another user', async () => {
      const response = await request
        .delete('/api/profiles/ogidan/unfollow')
        .set('Authorization', thirdUserToken);
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('message')
        .eql('You have Unfollowed ogidan');
    });
    it('Should not allow a user unfollow another user multiple times', async () => {
      const response = await request
        .delete('/api/profiles/ogidan/unfollow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(400);
    });
    it('Should not allow a user unfollow themself', async () => {
      const response = await request
        .delete('/api/profiles/emkay/unfollow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(409);
    });
    it('Should not allow a user unfollow an unknown user', async () => {
      const response = await request
        .delete('/api/profiles/fibonacci/unfollow')
        .set('Authorization', firstUserToken);
      expect(response).to.have.status(404);
    });
  });
});
