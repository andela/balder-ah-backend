import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chaiHttp from 'chai-http';
import app from '../../../src/server';
import NotificationsController from '../../../src/controllers/notificationsController';
import models from '../../../src/db/models';

const { Notification, User } = models;

chai.use(chaiHttp);
chai.use(sinonChai);
const { expect } = chai;

describe('Test for Notifications', () => {
  const data = {};
  describe('Opt in/out Notifications', () => {
    before(async () => {
      const response = await chai.request(app)
        .post('/api/users/signup')
        .send({
          email: 'jess@gmail.com',
          username: 'jess',
          password: 'jess1caing'
        });
      data.token = response.body.token;
    });

    it('should opt out of email notifications successfully', async () => {
      const response = await chai.request(app)
        .post('/api/user/notifications?email=no')
        .set('Authorization', data.token);

      expect(response.status).to.eql(200);
      expect(response.body.message).to.eql('Notification settings updated');
    });

    it('should opt out of in app notifications successfully', async () => {
      const response = await chai.request(app)
        .post('/api/user/notifications?app=no')
        .set('Authorization', data.token);

      expect(response.status).to.eql(200);
      expect(response.body.message).to.eql('Notification settings updated');
    });

    it('should opt in to email and app notifications successfully', async () => {
      const response = await chai.request(app)
        .post('/api/user/notifications?email=yes&app=yes')
        .set('Authorization', data.token);

      expect(response.status).to.eql(200);
      expect(response.body.message).to.eql('Notification settings updated');
    });

    it('should return 400 if any query param is incorrect', async () => {
      const response = await chai.request(app)
        .post('/api/user/notifications?app=no&email=wrong')
        .set('Authorization', data.token);

      expect(response.status).to.eql(400);
    });

    it('should fake a 500 error', async () => {
      const request = { userData: { payload: { id: 'wrong' } } };
      const response = { status() {}, json() {} };
      sinon.stub(response, 'status').returnsThis();
      await NotificationsController.optInOut(request, response);

      expect(response.status).to.have.been.calledWith(500);
    });
  });

  describe('Get all user notifications', () => {
    it('should return 404 if user has no notifications', async () => {
      const response = await chai.request(app)
        .get('/api/user/notifications')
        .set('Authorization', data.token);

      expect(response.status).to.eql(404);
      expect(response.body.status).to.eql('Fail');
      expect(response.body.message).to.eql('This user has no notifications at this time');
    });

    it('should return a user\'s notifications', async () => {
      const userId = (await User.findOne({ where: { username: 'jess' } })).id;
      await Notification.create({ userId, message: 'A notification' });
      const response = await chai.request(app)
        .get('/api/user/notifications')
        .set('Authorization', data.token);

      expect(response.status).to.eql(200);
      expect(response.body.status).to.eql('Success');
      expect(response.body.notifications).to.be.an('Array');
      expect(response.body.notifications[0]).to.be.an('Object');
    });

    it('should force a 500 error for getting notifications', async () => {
      const request = { userData: { payload: { id: 'bad' } } };
      const response = { status() { }, json() {} };
      sinon.stub(response, 'status').returnsThis();
      await NotificationsController.getNotifications(request, response);
      expect(response.status).to.have.been.calledWith(500);
    });
  });
});
