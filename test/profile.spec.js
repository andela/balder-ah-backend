import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';

import {
  completeProfileData,
  addSeedUser,
  removeSeedUsers,
  fakeUsername,
  lengthyUsername
} from '../src/db/seeders/user';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test for getting user profile', () => {
  before(async () => {
    // create remove existing users
    await addSeedUser(completeProfileData);
  });
  after(async () => {
    await removeSeedUsers();
  });

  it('Should return 200 for success retrieving a user', async () => {
    const response = await chai
      .request(server)
      .get(`/api/profiles/${completeProfileData.username}`);
    expect(response).to.have.status(200);
    expect(response.body.message).to.be.a('string');
  });

  it('Should return 404 if user can not be found', async () => {
    const response = await chai.request(server).get(`/api/profiles/${fakeUsername}`);
    expect(response).to.have.status(404);
    expect(response.body.message).to.be.a('string');
  });

  it('Should return 400 if username parameter is too long', async () => {
    const response = await chai.request(server).get(`/api/profiles/${lengthyUsername}`);
    expect(response).to.have.status(400);
    expect(response.body.errors)
      .to.be.an('object')
      .to.have.property('body')
      .to.contain('please username should be less than 100 characters');
  });
});
