import express from 'express';
import { userRouter, articlesRouter } from './routes';
import registerMiddlewares from './middlewares';

const app = express();
const PORT = process.env.PORT || 3000;

registerMiddlewares(app);

app.use('/api', userRouter);
app.use('/api', articlesRouter);


const server = app.listen(PORT, () => console.log(`Server listening on port ${server.address().port}`));

export default app;
