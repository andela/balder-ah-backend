export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Username already in use'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Username required!',
        },
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Email already in use'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email required!',
        },
        isEmail: {
          args: true,
          msg: 'Invalid email format'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
  });
  User.associate = (models) => {
    User.hasMany(models.Article, { foreignKey: 'userId', as: 'author' });
  };
  return User;
};
