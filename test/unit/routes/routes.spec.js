import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '../../../src/server';

let request;
chai.use(chaiHttp);

describe('Test app route', () => {
  before(() => {
    request = chai.request(server).keepOpen();
  });

  after(() => request.close());

  describe('Welcome message on API baseURL', () => {
    it('should show welcome message', async () => {
      const response = await request.get('/api');
      expect(response.body).to.have.property(
        'message',
        'Welcome to Team Balder Authors Haven app!'
      );
    });
  });

  describe('404 route', () => {
    it('should return 404 for invalid route', async () => {
      const response = await request.get('/not-valid-route');
      expect(response.status).to.equal(404);
    });
  });
});
