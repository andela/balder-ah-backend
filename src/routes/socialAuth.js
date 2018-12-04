import express from 'express';
import passport from 'passport';
import SocialAuthController from '../controllers/socialAuthController';

const socialAuthRouter = express.Router();

socialAuthRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);
socialAuthRouter.get(
  '/google/callback',
  passport.authenticate('google'),
  SocialAuthController.getToken
);

socialAuthRouter.get(
  '/facebook',
  passport.authenticate('facebook', {
    scope: ['email']
  })
);
socialAuthRouter.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  SocialAuthController.getToken
);

socialAuthRouter.get('/twitter', passport.authenticate('twitter'));

socialAuthRouter.get(
  '/twitter/callback',
  passport.authenticate('twitter'),
  SocialAuthController.getToken
);

export default socialAuthRouter;
