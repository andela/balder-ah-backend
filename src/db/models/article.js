export default (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    slug: {
      allowNull: false,
      type: DataTypes.STRING
    },
    title: {
      allowNull: false,
      unique: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    body: {
      allowNull: false,
      unique: false,
      type: DataTypes.TEXT
    },
    imgUrl: {
      allowNull: true,
      unique: false,
      type: DataTypes.TEXT
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    }
  });
  Article.associate = models => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });
  };
  return Article;
};
