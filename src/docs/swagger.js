import dotenv from 'dotenv';

dotenv.config();

const { APP_BASE_URL } = process.env;

export default {
  swagger: '2.0',
  info: {
    description: `Welcome the documentation of Authors Haven API. The base url for working with this api is ${APP_BASE_URL}/api`,
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
  basePath: '/api',
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
    '/users/signup': {
      post: {
        tags: ['users'],
        summary: 'Create new user',
        description: '',
        parameters: [
          {
            name: 'user',
            in: 'body',
            description: 'User object that is to be created',
            schema: {
              properties: {
                username: {
                  required: true,
                  type: 'string'
                },
                email: {
                  required: true,
                  type: 'string'
                },
                password: {
                  required: true,
                  type: 'string'
                }
              }
            }
          }
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Signed up successfully',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              },
              example: {
                message: 'Signed up successfully',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyNSwidXNlcm5hbWUiOiJtYXJjNTAifSwiaWF0IjoxNTQzNzAxMTY2LCJleHAiOjE1NDQ1NjUxNjZ9.jbGxB1LwW3CpT9KyFq9hXdSeztQ8xLrFWE-DQszcmkk'
              }
            }
          },
          400: {
            description: 'Validation exception'
          }
        }
      }
    },
    '/users/login': {
      post: {
        tags: ['users'],
        summary: 'Login user to the app',
        description: '',
        parameters: [
          {
            name: 'user',
            in: 'body',
            description: 'Existing user that want to login',
            schema: {
              properties: {
                username: {
                  required: true,
                  type: 'string'
                },
                password: {
                  required: true,
                  type: 'string'
                }
              }
            }
          }
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              },
              example: {
                message: 'Welome back',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyNSwidXNlcm5hbWUiOiJtYXJjNTAifSwiaWF0IjoxNTQzNzAxMTY2LCJleHAiOjE1NDQ1NjUxNjZ9.jbGxB1LwW3CpT9KyFq9hXdSeztQ8xLrFWE-DQszcmkk'
              }
            }
          },
          400: {
            description: 'Invalid login credentials'
          }
        }
      }
    }
  },
  definitions: {
    users: {
      required: [
        'username',
        'email',
        'password'
      ],
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          uniqueItems: true
        },
        username: {
          type: 'string',
          uniqueItems: true
        },
        email: {
          type: 'string',
          uniqueItems: true
        },
        password: {
          type: 'string'
        },
        createdAt: {
          readOnly: true,
          type: 'string'
        },
        updatedAt: {
          readOnly: true,
          type: 'string'
        }
      }
    },
  }
};
