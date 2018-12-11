export default (sequelize, DataTypes) => {
  const Rating = sequelize.define('Rating', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    rating: {
      allowNull: false,
      type: DataTypes.STRING
    }
  });
  Rating.associate = (models) => {
    Rating.belongsTo(models.Article, { foreignKey: 'articleSlug', as: 'article' });
  };
  return Rating;
};
