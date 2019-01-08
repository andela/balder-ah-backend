import express from 'express';
import passport from 'passport';

import registerSuperAdmin from './db/seeders/createSuperAdmin';

import {
  userRouter,
  articlesRouter,
  otherRouter,
  profileRouter,
  socialAuthRouter,
  searchRouter,
  tagsRouter,
  emailRouter,
  bookmarkRouter,
} from './routes';
import registerMiddlewares from './middlewares';
import './services/passport';
import appLogs from '../logger/logger';

const app = express();
const PORT = process.env.PORT || 3000;

registerMiddlewares(app);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', userRouter);
app.use('/api', emailRouter);
app.use('/api', articlesRouter);
app.use('/api', profileRouter);
app.use('/api', searchRouter);
app.use('/api/auth', socialAuthRouter);
app.use('/api', tagsRouter);
app.use('/api', bookmarkRouter);
app.use('/', otherRouter);
registerSuperAdmin();

app.listen(PORT, () => appLogs.info(`Server running on port ${PORT}`));

export default app;
