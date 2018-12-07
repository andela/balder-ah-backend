import dotenv from 'dotenv';

dotenv.config();

const { APP_BASE_URL } = process.env;

export default {
  swagger: '2.0',
  info: {
    description: `Welcome to the documentation of Authors Haven API. The base url for working with this api is ${APP_BASE_URL}/api`,
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
    },
    {
      name: 'profiles',
      description: "The details of the users of Author's Haven"
    },
    {
      name: 'ratings',
      description: 'The ratings posted on articles on Author\'s Haven'
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
    'users/forget': {
      post: {
        tags: ['users'],
        summary: 'Generates token for user reset password',
        description: '',
        parameters: [
          {
            name: 'user',
            in: 'body',
            description: 'Existing user that wants to reset password',
            schema: {
              properties: {
                email: {
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
                message: 'Password reset link has been sent to your mail',
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoyNSwidXNlcm5hbWUiOiJtYXJjNTAifSwiaWF0IjoxNTQzNzAxMTY2LCJleHAiOjE1NDQ1NjUxNjZ9.jbGxB1LwW3CpT9KyFq9hXdSeztQ8xLrFWE-DQszcmkk'
              }
            }
          },
          400: {
            description: 'Invalid email'
          }
        }
      }
    },
    'users/passwordupdate': {
      post: {
        tags: ['users'],
        summary: 'Resets user password',
        description: '',
        parameters: [
          {
            name: 'user',
            in: 'body',
            description: 'Existing user that wants to update password',
            schema: {
              properties: {
                newPassword: {
                  required: true,
                  type: 'string'
                },
                confirmPassword: {
                  required: true,
                  type: 'string'
                },
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
                message: 'The passwords do not match, confirm and type again.',
              }
            }
          },
          400: {
            description: 'Invalid email'
          }
        }
      }
    },
    '/verification': {
      get: {
        tags: ['users, email'],
        summary: 'Verify a new user',
        description: '',
        parameters: [],
        produces: ['application/json'],
        responses: {
          204: {
            description: 'Email already verified',
            schema: {
              properties: {
                message: {
                  type: 'string'
                }
              },
              example: {
                message: 'Email already verified'
              }
            }
          },
          201: {
            description: 'User verified',
            schema: {
              properties: {
                status: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                }
              },
              example: {
                status: 'Success',
                message: 'Your email: johndoe@example.com has been verified'
              }
            }
          },
          500: {
            description: 'Encountered an error verifying user'
          },
          404: {
            description: 'User not found'
          }
        }
      }
    },
    '/articles': {
      post: {
        tags: ['articles'],
        summary: 'Create article',
        description: '',
        parameters: [
          {
            name: 'article',
            in: 'body',
            required: true,
            description: '',
            schema: {
              title: {
                required: true,
                type: 'string'
              },
              description: {
                required: true,
                type: 'string'
              },
              body: {
                required: true,
                type: 'string'
              }
            }
          }
        ],
        produces: ['application/json'],
        responses: {
          200: {
            description: '',
            schema: {}
          }
        }
      },
      get: {
        tags: ['articles'],
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
          200: {
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
          200: {
            description: '',
            headers: {}
          }
        }
      },
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
          200: {
            description: '',
            headers: {}
          }
        }
      },
      delete: {
        tags: ['articles'],
        summary: 'Delete an article',
        operationId: 'UnnammedEndpointDelete',
        produces: ['application/json'],
        parameters: [],
        responses: {
          200: {
            description: '',
            headers: {}
          }
        }
      }
    },
    '/articles/{slug}/comments': {
      get: {
        summary: 'Get article comments',
        description: 'Returns all comments associated with an article',

        consumes: ['application/x-www-form-urlencoded'],
        responses: {
          200: {
            description: ''
          }
        },
        parameters: [
          {
            type: 'string',
            name: 'slug',
            in: 'path',
            required: true
          }
        ]
      },
      post: {
        summary: 'Comment on an article',
        description: 'Allows a user or author to comment on an article',

        consumes: ['application/x-www-form-urlencoded'],
        responses: {
          201: {
            description: ''
          }
        },
        parameters: [
          {
            type: 'string',
            name: 'slug',
            in: 'path',
            description: 'article slug to comment on',
            required: true
          },
          {
            type: 'string',
            name: 'body',
            required: true,
            in: 'formData'
          },
          {
            type: 'string',
            name: 'Authorization',
            description: 'Authorization token',
            required: true,
            in: 'header'
          }
        ]
      }
    },
    '/articles/{slug}/comments/{commentId}': {
      get: {
        summary: 'Get one comment on a specific article',
        description: 'Returns a comment on an article',

        consumes: ['application/x-www-form-urlencoded'],
        responses: {
          200: {
            description: ''
          }
        },
        parameters: [
          {
            type: 'string',
            name: 'slug',
            in: 'path',
            required: true
          },
          {
            type: 'string',
            name: 'commentId',
            in: 'path',
            required: true
          }
        ]
      }
    },
    '/auth/facebook': {
      get: {
        tags: ['users', 'social'],
        summary: 'Login/Signup to the app via facebook',
        description: '',
        produces: ['application/json'],
        responses: {
          201: {
            description: 'signup successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          },
          200: {
            description: 'login successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    '/auth/google': {
      get: {
        tags: ['users', 'social'],
        summary: 'Login/Signup to the app via google',
        description: '',
        produces: ['application/json'],
        responses: {
          201: {
            description: 'signup successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          },
          200: {
            description: 'login successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    '/auth/twitter': {
      get: {
        tags: ['users', 'social'],
        summary: 'Login/Signup to the app via twitter',
        description: '',
        produces: ['application/json'],
        responses: {
          201: {
            description: 'signup successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          },
          200: {
            description: 'login successful',
            schema: {
              properties: {
                message: {
                  type: 'string'
                },
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    '/user': {
      get: {
        tags: ['users, profile'],
        summary: 'Gets the profile/details of the currently logged in user',
        description: '',
        parameters: [],
        produces: ['application/json'],
        responses: {
          200: {
            description: 'Retrieved user successfully',
            schema: {
              properties: {
                status: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                },
                currentUser: {
                  type: 'object',
                  properties: {
                    username: { type: 'string' },
                    email: { type: 'string' },
                    bio: { type: 'string' },
                    image: { type: 'string' }
                  }
                }
              },
              example: {
                status: 'Success',
                message: 'Retrieved user successfully',
                currentUser: {
                  username: 'testuser',
                  email: 'test@mailinator.com',
                  bio: null,
                  image: null
                }
              }
            }
          },
          400: {
            description: 'Validation exception'
          }
        }
      },
      put: {
        tags: ['users, profile'],
        summary: 'Gets the profile/details of the currently logged in user',
        description: '',
        parameters: [
          {
            name: 'user',
            in: 'body',
            description: 'User object that is to be updated',
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
                bio: {
                  required: true,
                  type: 'string'
                },
                image: {
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
            description: 'Updated profile successfully',
            schema: {
              properties: {
                status: {
                  type: 'string'
                },
                message: {
                  type: 'string'
                }
              },
              example: {
                status: 'Success',
                message: 'Updated profile successfully'
              }
            }
          },
          400: {
            description: 'Validation exception'
          }
        }
      }
    },
    '/profiles/:username': {
      tags: ['users, profile'],
      summary: 'Get user profile',
      description: '',
      parameters: [],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Retrieved profile successfully',
          schema: {
            properties: {
              status: {
                type: 'string'
              },
              message: {
                type: 'string'
              },
              userProfile: {
                type: 'object',
                properties: {
                  username: { type: 'string' },
                  bio: { type: 'string' },
                  image: { type: 'string' }
                }
              }
            },
            example: {
              status: 'Success',
              message: 'Retrieved profile successfully',
              userProfile: {
                username: 'testuser',
                bio: 'This is a short bio',
                image: 'https://example.com/image.jpg'
              }
            }
          }
        },
        404: {
          description: 'User not found'
        }
      }
    }
  },
  definitions: {
    users: {
      required: ['username', 'email', 'password'],
      requiredForUpdate: ['email', 'username', 'bio', 'image'],
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
        bio: {
          type: 'string'
        },
        image: {
          type: 'string'
        },
        googleid: {
          type: 'string'
        },
        facebookid: {
          type: 'string'
        },
        twitterid: {
          type: 'string'
        },
        isVerified: {
          type: 'string'
        },
        emailtoken: {
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
    articles: {

      required: ['title', 'description', 'body'],
      properties: {
        title: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        body: {
          type: 'string'
        },
        userId: {
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
    ratings: {
      required: ['rating', 'articleSlug'],
      properties: {
        rating: {
          type: 'string'
        },
        articleSlug: {
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
    }
  }
};
