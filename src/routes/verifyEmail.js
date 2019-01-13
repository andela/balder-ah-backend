import express from 'express';
import emailVerifier from '../controllers/emailVerifier';

const emailRouter = express.Router();

emailRouter.get('/verification', emailVerifier);

export default emailRouter;
