export default (sequelize, DataTypes) => {
  const Article = sequelize.define(
    'Article',
    {
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
      },
      readtime: {
        type: DataTypes.STRING
      }
    },
    {
      hooks: {
        beforeCreate(article) {
          const articleBody = article.body;
          const articleBodyArray = articleBody.split(' ');
          const readTimeInMinutes = Math.round(articleBodyArray.length / 250) + 1;
          const readTimeString = `${readTimeInMinutes} mins`;
          article.readtime = readTimeString;
        },
        beforeBulkUpdate(article) {
          const { body } = article.attributes;
          const articleBodyArray = body.split(' ');
          const readTimeInMinutes = Math.round(articleBodyArray.length / 250) + 1;
          const readTimeString = `${readTimeInMinutes} mins`;
          article.fields.push('readtime');
          article.attributes.readtime = readTimeString;
        }
      },
    }

  );
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author'
    });

    Article.hasMany(models.Comment, {
      foreignKey: 'articleId'
    });

    Article.hasMany(models.Rating, { foreignKey: 'articleSlug', as: 'article' });
  };
  return Article;
};
