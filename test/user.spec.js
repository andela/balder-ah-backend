import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../src/server';
import {
  successfulSignup, successfulLogin, nonExistingEmail, incorrectPassword
} from '../src/db/seeders/user';

const { expect } = chai;

chai.use(chaiHttp);

describe('Test for user signup', () => {
  it('Should return 201 for success', async () => {
    const response = await chai.request(server)
      .post('/api/users/signup')
      .send(successfulSignup);
    expect(response).to.have.status(201);
    expect(response.body.message).to.be.a('string');
    expect(response.body).to.have.property('token');
  });
});

describe('Test for user login', () => {
  it('Should return 200 for success', async () => {
    const response = await chai.request(server)
      .post('/api/users/login')
      .send(successfulLogin);
    expect(response).to.have.status(200);
    expect(response.body.message).to.be.a('string');
    expect(response.body).to.have.property('token');
  });
  it('Should return 404 nonExistingEmail', async () => {
    const response = await chai.request(server)
      .post('/api/users/login')
      .send(nonExistingEmail);
    expect(response).to.have.status(404);
    expect(response.body.message).to.be.a('string');
    expect(response.body.status).to.equal('Fail');
  });
  it('Should return 401 for incorrect password', async () => {
    const response = await chai.request(server)
      .post('/api/users/login')
      .send(incorrectPassword);
    expect(response).to.have.status(401);
    expect(response.body.message).to.be.a('string');
    expect(response.body.status).to.equal('Fail');
  });
});
