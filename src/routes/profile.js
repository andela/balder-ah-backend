import express from 'express';
import { getUserProfile } from '../controllers/userProfileHandler';
import checkUsernameParam from '../middlewares/paramsHandler';
import FollowController from '../controllers/followController';
import { verifyToken } from '../middlewares/authentication';

const {
  followUser, unfollowUser, getAllFollowing, getAllFollowers
} = FollowController;

const profileRouter = express.Router();

profileRouter.get('/profiles/:username', checkUsernameParam, getUserProfile);
profileRouter.post('/profiles/:username/follow', verifyToken, checkUsernameParam, followUser);
profileRouter.delete('/profiles/:username/unfollow', verifyToken, checkUsernameParam, unfollowUser);
profileRouter.get('/profiles/:username/followings', verifyToken, checkUsernameParam, getAllFollowing);
profileRouter.get('/profiles/:username/followers', verifyToken, checkUsernameParam, getAllFollowers);

export default profileRouter;
