import express from 'express';
import { userRouter, otherRouter } from './routes';
import registerMiddlewares from './middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

registerMiddlewares(app);

app.use('/api', userRouter);

app.use('/', otherRouter);

const server = app.listen(PORT, () => console.log(`Server listening on port ${server.address().port}`));

export default app;
