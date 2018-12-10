export default (sequelize, DataTypes) => {
  const ArticleTags = sequelize.define('ArticleTags', {
    tagId: DataTypes.INTEGER,
    articleId: DataTypes.INTEGER
  }, {});
  ArticleTags.associate = () => {
  };
  return ArticleTags;
};
