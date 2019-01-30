import express from 'express';
import { getUserProfile, getAllProfiles } from '../controllers/userProfileController';
import checkUsernameParam from '../middlewares/paramsHandler';
import FollowController from '../controllers/followController';
import { verifyToken } from '../middlewares/authentication';

const {
  followUser, unFollowUser, getAllFollowing, getAllFollowers
} = FollowController;

const profileRouter = express.Router();

profileRouter.get('/profiles/:username', checkUsernameParam, getUserProfile);
profileRouter.get(
  '/profiles/:username/followings',
  verifyToken,
  checkUsernameParam,
  getAllFollowing
);
profileRouter.get(
  '/profiles/:username/followers',
  verifyToken,
  checkUsernameParam,
  getAllFollowers
);
profileRouter.get('/profiles', verifyToken, getAllProfiles);
profileRouter.post('/profiles/:username/follow', verifyToken, checkUsernameParam, followUser);
profileRouter.post('/profiles/:username/unfollow', verifyToken, checkUsernameParam, unFollowUser);

export default profileRouter;
