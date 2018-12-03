import express from 'express';
import { registerUser, loginUser } from '../controllers/users';

const userRouter = express.Router();

userRouter.post('/users/signup', registerUser);
userRouter.post('/users/login', loginUser);

export default userRouter;
