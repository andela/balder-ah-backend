import dotenv from 'dotenv';

dotenv.config();

const { APP_BASE_URL } = process.env;

export default {
  swagger: '2.0',
  info: {
    description: `Welcome to Authors Haven's API documentation. The base url for the API is ${APP_BASE_URL}/api`,
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
      description: 'The users of Author\'s Haven'
    },
    {
      name: 'articles',
      description: 'The articles created by Author\'s Haven users'
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
                token:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyNSwidXNlcm5hbWUiOiJtYXJjNTAifSwiaWF0IjoxNTQzNzAxMTY2LCJleHAiOjE1NDQ1NjUxNjZ9.jbGxB1LwW3CpT9KyFq9hXdSeztQ8xLrFWE-DQszcmkk'
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
                token:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyNSwidXNlcm5hbWUiOiJtYXJjNTAifSwiaWF0IjoxNTQzNzAxMTY2LCJleHAiOjE1NDQ1NjUxNjZ9.jbGxB1LwW3CpT9KyFq9hXdSeztQ8xLrFWE-DQszcmkk'
              }
            }
          },
          400: {
            description: 'Invalid login credentials'
          }
        }
      }
    },
    '/articles': {
      post: {
        summary: 'Create article',
        operationId: 'ArticlesUserIdPost',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Body',
            in: 'body',
            required: true,
            description: '',
            schema: {
              $ref: '#/definitions/CreatearticleRequest'
            }
          },
          {
            name: 'Content-Type',
            in: 'header',
            required: true,
            type: 'string',
            description: ''
          }
        ],
        responses: {
          '200': {
            description: '',
            headers: {}
          }
        }
      }
    },
    '/articles': {
      get: {
        summary: 'Get all article',
        operationId: 'ArticlesGet',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Content-Type',
            in: 'header',
            required: true,
            type: 'string',
            description: ''
          }
        ],
        responses: {
          '200': {
            description: '',
            headers: {}
          }
        }
      }
    },
    '/articles/slug': {
      get: {
        summary: 'Get one article',
        operationId: 'ArticlesSlugGet',
        produces: ['application/json'],
        parameters: [],
        responses: {
          '200': {
            description: '',
            headers: {}
          }
        }
      }
    },
    '/articles/slug': {
      put: {
        summary: 'Update an article',
        operationId: 'ArticlesUserIdSlugPut',
        produces: ['application/json'],
        parameters: [
          {
            name: 'Body',
            in: 'body',
            required: true,
            description: '',
            schema: {
              $ref: '#/definitions/UpdateanarticleRequest'
            }
          },
          {
            name: 'Content-Type',
            in: 'header',
            required: true,
            type: 'string',
            description: ''
          }
        ],
        responses: {
          '200': {
            description: '',
            headers: {}
          }
        }
      }
    },
    '//': {
      delete: {
        summary: 'Delete an article',
        operationId: 'UnnammedEndpointDelete',
        produces: ['application/json'],
        parameters: [],
        responses: {
          '200': {
            description: '',
            headers: {}
          }
        }
      }
    }
  },
  definitions: {
    users: {
      required: ['username', 'email', 'password'],
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
    CreatearticleRequest: {
      title: 'CreateArticleRequest',
      example: {
        title: 'Bootcamping',
        description: 'I was too nervous',
        body: 'Nah, I can become anything I want'
      },
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        body: {
          type: 'string'
        }
      },
      required: ['title', 'description', 'body']
    },
    UpdateanarticleRequest: {
      title: 'UpdateaAarticleRequest',
      example: {
        title: '',
        description: '',
        body: ''
      },
      type: 'object',
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        body: {
          type: 'string'
        }
      },
      required: ['title', 'description', 'body']
    }
  }
};
