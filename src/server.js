import express from 'express';
import passport from 'passport';
import {
  userRouter,
  articlesRouter,
  otherRouter,
  profileRouter,
  socialAuthRouter,
  emailRouter,
  searchRouter
} from './routes';
import registerMiddlewares from './middlewares';
import './services/passport';

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
app.use('/', otherRouter);

app.listen(PORT);

export default app;
