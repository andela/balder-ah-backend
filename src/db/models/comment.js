export default (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {}
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    Comment.belongsTo(models.User, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: 'userId',
      as: 'author'
    });
  };
  return Comment;
};
