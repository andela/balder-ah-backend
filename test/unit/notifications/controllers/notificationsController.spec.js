import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import NotificationsController from '../../../../src/controllers/notificationsController';
import Notifier from '../../../../src/helpers/notification';
import pusher from '../../../../src/services/pusher';
import models from '../../../../src/db/models';

const { Notification } = models;

chai.use(sinonChai);
const { expect } = chai;

before(() => {
  sinon.stub(NotificationsController, 'newArticle').returns(undefined);
  sinon.stub(NotificationsController, 'newComment').returns(undefined);
  sinon.stub(NotificationsController, 'newFollower').returns(undefined);
});

after(() => sinon.restore());

describe('Notifications Controller Unit tests', () => {
  beforeEach(() => {
    sinon.restore();
    sinon.stub(Notifier, 'forNewArticle').returns([[2, 3], 'new notif']);
    sinon.stub(Notifier, 'forNewComment').returns([[2, 3], 'new notif']);
    sinon.stub(Notifier, 'forNewFollower').returns(['yourVillagePeople just followed you']);
    sinon.stub(Notifier, 'getUnsubscribedUsers').returns([1]);
    sinon.stub(Notification, 'bulkCreate').returns(undefined);
    sinon.stub(Notification, 'create').returns(undefined);
    sinon.stub(pusher, 'triggerBatch').returns(undefined);
    sinon.stub(pusher, 'trigger').returns(undefined);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('newArticle()', async () => {
    await NotificationsController.newArticle(1);
    const events = [{
      channel: 'balderah-notifications',
      name: 'notify-2',
      data: { message: 'new notif' }
    }, {
      channel: 'balderah-notifications',
      name: 'notify-3',
      data: { message: 'new notif' }
    }];

    expect(pusher.triggerBatch).to.have.been.calledWith(events);
  });

  it('newComment()', async () => {
    await NotificationsController.newComment(1);
    const events = [{
      channel: 'balderah-notifications',
      name: 'notify-2',
      data: { message: 'new notif' }
    }, {
      channel: 'balderah-notifications',
      name: 'notify-3',
      data: { message: 'new notif' }
    }];

    expect(pusher.triggerBatch).to.have.been.calledWith(events);
  });

  it('newFollower()', async () => {
    await NotificationsController.newFollower(100, 'some@random.email', 200);
    expect(pusher.trigger).to.have.been.calledWith(
      'balderah-notifications',
      'notify-100',
      { message: 'yourVillagePeople just followed you' }
    );
  });
});
