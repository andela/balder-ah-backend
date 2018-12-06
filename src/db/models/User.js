import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username is already taken'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Please provide username'
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Email address is already registered'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Please provide email address'
          },
          isEmail: {
            args: true,
            msg: 'Email address is invalid'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isByteLength: {
            args: 8,
            msg: 'Password must be at least 8 characters long'
          },
          isAlphanumeric(value) {
            value = value.trim();
            if (!/[^\s\\]/.test(value)) {
              throw new Error('Password should be alphanumeric e.g. abc123');
            }
          }
        }
      },
      googleid: {
        type: DataTypes.STRING,
        allowNull: true
      },
      facebookid: {
        type: DataTypes.STRING,
        allowNull: true
      },
      twitterid: {
        type: DataTypes.STRING,
        token: {
          type: DataTypes.STRING,
          allowNull: true
        },
        passwordExpiresIn: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        bio: {
          type: DataTypes.STRING,
          allowNull: true
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isUrl: {
              args: true,
              msg: 'Invalid image format'
            }
          }
        }
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      emailtoken: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      hooks: {
        beforeCreate(user) {
          const rawPassword = user.password;
          user.password = bcrypt.hashSync(rawPassword, 10);
        },
        beforeUpdate(user) {
          const rawPassword = user.password;
          user.password = bcrypt.hashSync(rawPassword, 10);
        }
      }
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Article, { foreignKey: 'userId', as: 'author' });
  };
  return User;
};
