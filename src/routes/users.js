import express from 'express';
import { registerUser, loginUser } from '../controllers/users';
import { getCurrentUser, updateProfile } from '../controllers/userProfileHandler';
import { verifyToken } from '../middlewares/authentication';
import {
  checkUndefined,
  checkEmpty,
  checkLength,
  checkImageUrl
} from '../middlewares/updateHandler';
import checkUndefinedPass from '../middlewares/userAuthHandler';

const userRouter = express.Router();

userRouter.post('/users/signup', checkUndefinedPass, registerUser);
userRouter.post('/users/login', checkUndefinedPass, loginUser);

//  route to get details of currently logged in user
userRouter.get('/user', verifyToken, getCurrentUser);

//  route to update user's profile
userRouter.put(
  '/user',
  verifyToken,
  checkUndefined,
  checkEmpty,
  checkLength,
  checkImageUrl,
  updateProfile
);

export default userRouter;
