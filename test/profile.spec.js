import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import server from '../src/server';
import models from '../src/db/models';

import {
  completeProfileData,
  addSeedUser,
  removeSeedUsers,
  fakeUsername,
  lengthyUsername
} from '../src/db/seeders/user';
import {
  getCurrentUser,
  getUserProfile,
  updateProfile
} from '../src/controllers/userProfileHandler';
import checkUsernameParam from '../src/middlewares/paramsHandler';

const { User } = models;

chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);

describe('Test for getting user profile', () => {
  before(async () => {
    await addSeedUser(completeProfileData);
  });

  afterEach(() => sinon.restore());

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

  it('fakes server error when getting current user', async () => {
    const request = {
      userData: {
        payload: {
          id: 1
        }
      }
    };

    const response = {
      status() {},
      json() {}
    };

    sinon.stub(User, 'findOne').throws();
    sinon.stub(response, 'status').returnsThis();

    await getCurrentUser(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('fakes server error when updating user profile', async () => {
    const request = {
      userData: {
        payload: {
          id: 1
        }
      }
    };

    const response = {
      status() {},
      json() {}
    };

    sinon.stub(User, 'findOne').throws();
    sinon.stub(response, 'status').returnsThis();

    await updateProfile(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('fakes update profile and cover all branch', async () => {
    const request = {
      userData: {
        payload: {
          id: 1
        }
      },
      body: {
        username: '',
        email: '',
        bio: '',
        image: ''
      }
    };

    const response = {
      status() {},
      json() {}
    };

    const userModel = User;

    sinon.stub(userModel, 'findOne').resolves({
      username: 'johnwick',
      email: 'johnwick@mail.com',
      bio: 'I love to shoot',
      image: '🔫',
      id: 1
    });

    sinon.stub(userModel, 'update').returns(true);
    sinon.stub(response, 'status').returnsThis();

    await updateProfile(request, response);
    expect(response.status).to.have.been.calledWith(200);
  });

  it('fakes server error when getting user profile', async () => {
    const request = {
      params: {
        username: ''
      }
    };

    const response = {
      status() {},
      json() {}
    };

    sinon.stub(User, 'findOne').throws();
    sinon.stub(response, 'status').returnsThis();

    await getUserProfile(request, response);

    expect(response.status).to.have.been.calledWith(500);
  });

  it('fail to check username', async () => {
    const request = {
      params: {
        username: ''
      }
    };
    const response = {
      status() {},
      json() {}
    };

    sinon.stub(response, 'status').returnsThis();
    await checkUsernameParam(request, response);

    expect(response.status).to.have.been.calledWith(400);
  });
});
