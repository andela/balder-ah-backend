export default (sequelize, DataTypes) => {
  const Statistics = sequelize.define('Statistics', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    author: {
      allowNull: false,
      type: DataTypes.STRING
    },
    articleSlug: {
      allowNull: false,
      type: DataTypes.STRING
    },
    readCount: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  Statistics.associate = (models) => {
    Statistics.belongsTo(models.Article, { foreignKey: 'articleSlug', as: 'article' });
  };
  return Statistics;
};
