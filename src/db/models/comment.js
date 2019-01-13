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
      },
      history: {
        type: DataTypes.ARRAY(DataTypes.JSON),
      },
      edited: {
        type: DataTypes.BOOLEAN
      }
    },
    {
      hooks: {
        beforeCreate(comment) {
          comment.history = [JSON.stringify(comment.history)];
        }
      }
    }
  );
  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      foreignKey: 'articleId'
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
