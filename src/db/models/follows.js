export default (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followerId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
  }, {});
  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      as: 'following',
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Follow.belongsTo(models.User, {
      as: 'myFollowers',
      foreignKey: 'followerId',
      onDelete: 'CASCADE'
    });
  };
  return Follow;
};
