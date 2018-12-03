import express from 'express';

const otherRouter = express.Router();

otherRouter.get('/api', (request, response) => response.status(200)
  .json({
    message: 'Welcome to Team Balder Authors Haven app!'
  }));

otherRouter.all('*', (request, response) => response.status(404)
  .json({
    message: 'oooop! This page does not exist'
  }));

export default otherRouter;
