module.exports = (sequelize, DataTypes) => {
  const HighlightedText = sequelize.define('HighlightedText', {
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
  HighlightedText.associate = (models) => {
    HighlightedText.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'author'
    });
  };
  HighlightedText.associate = (models) => {
    HighlightedText.belongsTo(models.Article, {
      foreignKey: 'articleId',
      onDelete: 'CASCADE',
    });
  };
  return HighlightedText;
};
