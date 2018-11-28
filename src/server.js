const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const registerMiddlewares = require('./middlewares');
const { User } = require('./db/models');

registerMiddlewares(app);

// this tests that db is connected and models are working as expected
// TODO: should be removed
app.get('*', (req, res) => User.all()
  .then(users => res.send(users))
  .catch(err => res.send(err.message)));

const server = app.listen(PORT, () => console.log(`Server listening on port ${server.address().port}`));
