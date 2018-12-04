import express from 'express';
import { getUserProfile } from '../controllers/userProfileHandler';
import checkUsernameParam from '../middlewares/paramsHandler';

const profileRouter = express.Router();

profileRouter.get('/profiles/:username', checkUsernameParam, getUserProfile);

export default profileRouter;
