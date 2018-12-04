import chai from 'chai';
import SocialAuthController from '../../../src/controllers/socialAuthController';

const { expect } = chai;

describe('Social Login', () => {
  describe('callback urls', () => {
    const facebookCallbackData = {
      accessToken: {},
      refreshToken: {},
      profile: {
        id: 'lololo',
        name: { familyName: 'Akhilome', givenName: 'Kizito', middleName: undefined },
        emails: [{ value: 'hovkard@gmail.com' }],
        photos: [{ value: 'https://someurl.tld/an-image.png' }],
      },
      done: (param1, details) => details
    };

    const googleCallbackData = {
      accessToken: {},
      refreshToken: {},
      profile: {
        id: 'hahahaha',
        displayName: 'Kizito Akhilome',
        name: { familyName: 'Akhilome', givenName: 'Kizito' },
        emails: [{ value: 'kizito.akhilome@andela.com', type: 'account' }],
        photos: [{ value: 'https://someurl.tld/an-image.png' }],
        provider: 'google'
      },
      done: (param1, details) => details
    };

    const twitterCallbackData = {
      accessToken: {},
      refreshToken: {},
      profile: {
        id: '1069132266562039808',
        username: 'kizitodotdev',
        displayName: 'Kizito',
        emails: [{ value: 'kizito@akhilo.me' }],
        photos: [{ value: 'https://someurl.tld/an-image.png' }],
        provider: 'twitter'
      },
      done: (param1, details) => details
    };

    it('should hit facebook social auth callback', () => {
      const facebookUserDetails = SocialAuthController.facebookCallback(
        facebookCallbackData.accessToken,
        facebookCallbackData.refreshToken,
        facebookCallbackData.profile,
        facebookCallbackData.done
      );

      expect(facebookUserDetails).to.eql(undefined);
    });

    it('should hit google social auth callback', () => {
      const googleUserDetails = SocialAuthController.googleCallback(
        googleCallbackData.accessToken,
        googleCallbackData.refreshToken,
        googleCallbackData.profile,
        googleCallbackData.done
      );

      expect(googleUserDetails).to.eql(undefined);
    });

    it('should hit twitter social auth callback', () => {
      const twitterUserDetails = SocialAuthController.twitterCallback(
        twitterCallbackData.accessToken,
        twitterCallbackData.refreshToken,
        twitterCallbackData.profile,
        twitterCallbackData.done
      );

      expect(twitterUserDetails).to.eql(undefined);
    });
  });

  describe('get token for social auth', () => {
    const newUserRequest = {
      user: {
        id: 21,
        username: 'somebody',
        isNewUser: true
      }
    };

    const existingUserRequest = {
      user: {
        id: 21,
        username: 'somebody',
        isNewUser: false
      }
    };

    const response = {
      status() {
        return this;
      },
      json(obj) {
        return obj;
      }
    };

    it('should successfully provide JWT for social signup', async () => {
      const userDetails = SocialAuthController.getToken(newUserRequest, response);

      expect(userDetails).to.be.an('object');
      expect(userDetails.token).to.be.a('string');
      expect(userDetails.message).to.eql('Signed up successfully');
    });

    it('should successfully provide JWT for social login', async () => {
      const userDetails = SocialAuthController.getToken(existingUserRequest, response);

      expect(userDetails).to.be.an('object');
      expect(userDetails.token).to.be.a('string');
      expect(userDetails.message).to.contain('Welcome back');
    });
  });
});
