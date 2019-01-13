import express from 'express';
import { resetToken, updateUserPassword } from '../controllers/sendResetToken';

import {
  registerUser,
  loginUser,
  assignRole,
  deleteUser
} from '../controllers/userController';
import { getCurrentUser, updateProfile } from '../controllers/userProfileController';
import { verifyToken } from '../middlewares/authentication';
import {
  checkUndefined,
  checkEmpty,
  checkLength,
  checkImageUrl
} from '../middlewares/updateHandler';
import checkUndefinedPass from '../middlewares/userAuthHandler';
import NotificationsController from '../controllers/notificationsController';
import {
  verifyPasswordResetToken,
  verifyUserStatus,
  validateUpdateInputs,
  verifyAdminOrSuperAdmin,
  findOneUser
} from '../middlewares/helper';

const userRouter = express.Router();

userRouter.post('/users/signup', checkUndefinedPass, registerUser);
userRouter.post('/users/login', checkUndefinedPass, loginUser);
userRouter.post('/users/resetpassword', resetToken);
userRouter.post('/users/updatepassword', verifyPasswordResetToken, updateUserPassword);
userRouter.delete('/users/deleteuser', verifyToken, verifyAdminOrSuperAdmin, findOneUser, deleteUser);
userRouter.put('/users/assignrole', verifyToken, verifyUserStatus, validateUpdateInputs, findOneUser, assignRole);

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

// notifications
userRouter.post('/user/notifications', verifyToken, NotificationsController.optInOut);
userRouter.get('/user/notifications', verifyToken, NotificationsController.getNotifications);

export default userRouter;
