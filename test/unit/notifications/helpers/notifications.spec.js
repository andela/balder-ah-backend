import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sgMail from '@sendgrid/mail';
import Notifier from '../../../../src/helpers/notification';
import models from '../../../../src/db/models';

chai.use(sinonChai);
const { expect } = chai;
const { User, Article } = models;

describe('Notifications Helper Unit tests', () => {
  beforeEach(() => {
    sinon.stub(User, 'findAll').returns([{ id: 1, email: 'email 1' }, { id: 2, email: 'email 2' }]);
    sinon.stub(Article, 'findByPk').returns({
      title: 'An articulate article',
      favoritesCount: [
        { author: { email: 'hovkard@gmail.com', id: 1 } },
        { author: { email: 'second@email.address', id: 2 } }
      ]
    });
    sinon.stub(User, 'findByPk').returns({
      username: 'kay',
      followers: [
        { id: 1, email: 'first@email.address' },
        { id: 2, email: 'second@email.address' }
      ]
    });
    sinon.stub(sgMail, 'sendMultiple').returns(undefined);
    sinon.stub(sgMail, 'send').returns(undefined);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('getUnsubscribedUsers()', async () => {
    const appUsers = await Notifier.getUnsubscribedUsers('app');
    const emailUsers = await Notifier.getUnsubscribedUsers('email');

    expect(emailUsers).to.be.an('array').which.contains('email 1');
    expect(appUsers).to.be.an('array').which.contains(1);
  });

  it('forNewComment()', async () => {
    const [userIds, message] = await Notifier.forNewComment(1);

    expect(sgMail.sendMultiple.calledOnce).to.eql(true);
    expect(message).to.eql('An articulate article has a new comment');
    expect(userIds).to.be.an('array');
    expect(userIds[0]).to.be.a('number');
  });

  it('forNewArticle()', async () => {
    const [userIds, message] = await Notifier.forNewArticle(1);

    expect(sgMail.sendMultiple.calledOnce).to.eql(true);
    expect(message).to.eql('kay just published a new article.');
    expect(userIds).to.be.an('array');
    expect(userIds[0]).to.be.a('number');
  });

  it('forNewFollower()', async () => {
    const [message] = await Notifier.forNewFollower('some@random.email', 1);

    expect(sgMail.send.calledOnce).to.eql(true);
    expect(message).to.eql('kay just followed you.');
  });
});
