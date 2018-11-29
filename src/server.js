import express from 'express';
import registerMiddlewares from './middlewares';
import { User } from './db/models';

const app = express();
const PORT = process.env.PORT || 3000;

registerMiddlewares(app);

// this tests that db is connected and models are working as expected
// TODO: should be removed
app.get('*', (req, res) => User.all()
  .then(users => res.send(users))
  .catch(err => res.send(err.message)));

const server = app.listen(PORT, () => console.log(`Server listening on port ${server.address().port}`));
