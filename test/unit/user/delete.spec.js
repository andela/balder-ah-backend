import chai from 'chai';
import chaiHttp from 'chai-http';
import models from '../../../src/db/models';
import server from '../../../src/server';
import {
  successfulSignup5,
  loginSuperUser,
  userToAssignRole,
  userToDelete,
  userToDelete1,
  successfulSignup6
} from '../../../src/db/seeders/user';
import registerSuperAdmin from '../../../src/db/seeders/createSuperAdmin';

const { User } = models;
const { expect } = chai;

chai.use(chaiHttp);

let request;
const signupEndpoint = '/api/users/signup';
const loginEndpoint = '/api/users/login';
const deleteUserEndpoint = '/api/users/deleteuser';
const assignRoleEndpoint = '/api/users/assignrole';

let userToken;
let superUserToken;
let userLogIn1;
let userLogIn1Token;
describe('Test for deleting a user by admin or super admin', () => {
  before(async () => {
    request = chai.request(server).keepOpen();
    await request.post(signupEndpoint).send(successfulSignup5);
    userLogIn1 = await request.post(loginEndpoint).send(successfulSignup5);
    userLogIn1Token = userLogIn1.body.token;
    await request.post(signupEndpoint).send(successfulSignup6);
    await registerSuperAdmin();
    const superUser = await request.post(loginEndpoint).send(loginSuperUser);
    superUserToken = superUser.body.token;
    await request.put(assignRoleEndpoint).set('Authorization', superUserToken).send(userToAssignRole);
    const newAdmin = await request.post(loginEndpoint).send(successfulSignup5);
    userToken = newAdmin.body.token;
  });
  after(async () => {
    await User.destroy({ cascade: true, truncate: true });
    request.close();
  });
  it('should return 200 for deleting a user by an admin', async () => {
    const response = await request.delete(deleteUserEndpoint)
      .set('Authorization', userToken)
      .send(userToDelete);
    expect(response).to.have.status(200);
    expect(response.body).to.have.property('status').eql('Success');
    expect(response.body).to.have.property('message').eql('User deleted successfully');
  });
  it('should return 403 for deleting a user by a non admin', async () => {
    const response = await request.delete(deleteUserEndpoint)
      .set('Authorization', userLogIn1Token)
      .send(userToDelete);
    expect(response).to.have.status(403);
    expect(response.body).to.have.property('status').eql('Fail');
    expect(response.body).to.have.property('message').eql('You are not authorised to perform this operation');
  });
  it('should return 404 for trying to delete a none existing user', async () => {
    const response = await request.delete(deleteUserEndpoint)
      .set('Authorization', userToken)
      .send(userToDelete1);
    expect(response).to.have.status(404);
    expect(response.body).to.have.property('status').eql('Fail');
    expect(response.body).to.have.property('message').eql('User does not exist');
  });
});
