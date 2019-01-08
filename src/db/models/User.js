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
        allowNull: false,
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
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      emailtoken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      appNotifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        allowNull: false
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
    User.hasMany(models.Article, { foreignKey: 'userId', as: 'articles' });
    User.hasMany(models.Comment, { foreignKey: 'userId', as: 'comments' });
    User.belongsToMany(models.User, {
      foreignKey: 'userId',
      as: 'followers',
      through: 'Follows'
    });
    User.belongsToMany(models.User, {
      foreignKey: 'followerId',
      as: 'following',
      through: 'Follows'
    });
    User.hasMany(models.Favorite, { foreignKey: 'userId', as: 'favorites' });
  };
  return User;
};
