import express from 'express';
import { resetToken, updateUserPassword } from '../controllers/sendResetToken';

import { registerUser, loginUser } from '../controllers/userController';
import { getCurrentUser, updateProfile } from '../controllers/userProfileController';
import { verifyToken } from '../middlewares/authentication';
import {
  checkUndefined,
  checkEmpty,
  checkLength,
  checkImageUrl
} from '../middlewares/updateHandler';
import checkUndefinedPass from '../middlewares/userAuthHandler';
import { verifyPasswordResetToken } from '../middlewares/helper';

const userRouter = express.Router();

userRouter.post('/users/signup', checkUndefinedPass, registerUser);
userRouter.post('/users/login', checkUndefinedPass, loginUser);
userRouter.post('/users/resetpassword', resetToken);
userRouter.post('/users/updatepassword', verifyPasswordResetToken, updateUserPassword);

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
