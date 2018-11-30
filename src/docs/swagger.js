import dotenv from 'dotenv';

dotenv.config();

const { APP_BASE_URL } = process.env;

export default {
  swagger: '2.0',
  info: {
    description: `Welcome to v1 (version 1) documentation of Authors Haven API. The base url for working with this api is ${APP_BASE_URL}/api/v1`,
    version: '1.0.0',
    title: 'Authors Haven API',
    contact: {
      name: 'Team Balder 42',
      url: 'https://github.com/andela/balder-ah-backend'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  host: APP_BASE_URL,
  basePath: '/api/v1',
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'users',
      description: "The users of Author's Haven"
    },
    {
      name: 'articles',
      description: "The articles created by Author's Haven users"
    }
  ],
  schemes: ['https', 'http'],
  paths: {
    // docs for endpoints here
  }
};
