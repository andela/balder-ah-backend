import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../../../src/db/models';
import server from '../../../src/server';
import {
  successfulSignup4,
  loginSuperUser
} from '../../../src/db/seeders/user';
import registerSuperAdmin from '../../../src/db/seeders/createSuperAdmin';

const { User } = models;
const { expect } = chai;

chai.use(chaiHttp);

let request;
const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';
const assignRoleEndpoint = '/api/users/assignrole';
let userToken;
let superUserToken;

describe('Test for role base access control', () => {
  before(async () => {
    request = chai.request(server).keepOpen();
    const user = await request.post(signupEndpoint).send(successfulSignup4);
    userToken = user.body.token;
    await registerSuperAdmin();
    const superUser = await request.post(loginEndpoint)
      .send(loginSuperUser);
    superUserToken = superUser.body.token;
  });
  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    request.close();
  });
  describe('test for assigning role by super admin', () => {
    it('should return 403 for a non admin user', async () => {
      const payload = {
        email: 'okoros@gmail.com',
        status: 'admin'
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', userToken)
        .send(payload);
      expect(response).to.have.status(403);
      expect(response.body.status).to.equal('Fail');
      expect(response.body.message).to.equal('You are not authorised to perform this operation');
    });
    it('should return 400 for empty email fields', async () => {
      const payload = {
        email: '',
        role: 'superAdmin'
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', superUserToken)
        .send(payload);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('status').eql('Fail');
      expect(response.body).to.have.property('message').eql('Email field is required');
    });
    it('should return 400 for role email fields', async () => {
      const payload = {
        email: 'okoroemeka056@gmail.com',
        role: ''
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', superUserToken)
        .send(payload);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('status').eql('Fail');
      expect(response.body).to.have.property('message').eql('Role field is required');
    });
    it('should return 200 for succefull assigning of role', async () => {
      const payload = {
        email: 'okorosolo@gmail.com',
        role: 'admin'
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', superUserToken)
        .send(payload);
      expect(response).to.have.status(200);
      expect(response.body).to.have.property('status').eql('Success');
      expect(response.body.updatedUser[1][0]).to.have.property('role').eql('admin');
    });
    it('should return 404 for a non existing propective admin user', async () => {
      const payload = {
        email: 'okorolo@gmail.com',
        role: 'admin'
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', superUserToken)
        .send(payload);
      expect(response).to.have.status(404);
      expect(response.body).to.have.property('status').eql('Fail');
      expect(response.body).to.have.property('message').eql('User does not exist');
    });
    it('should return 400 for a wrong user role', async () => {
      const payload = {
        email: 'okorosolo@gmail.com',
        role: 'min'
      };
      const response = await request.put(assignRoleEndpoint)
        .set('Authorization', superUserToken)
        .send(payload);
      expect(response).to.have.status(400);
      expect(response.body).to.have.property('status').eql('Fail');
      expect(response.body).to.have.property('message').eql(`Status can only be ${"'admin'"} or ${"'user'"}`);
    });
  });
});
