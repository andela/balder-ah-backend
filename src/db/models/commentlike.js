export default (sequelize, DataTypes) => {
  const CommentReaction = sequelize.define('CommentReaction', {
    isLiked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    likedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true
    },
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      required: true
    }
  });
  CommentReaction.associate = (models) => {
    CommentReaction.belongsTo(models.User, {
      foreignKey: 'likedBy',
      as: 'author'
    });
    CommentReaction.belongsTo(models.Comment, { foreignKey: 'commentId' });
  };
  return CommentReaction;
};
