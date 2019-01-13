export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Statistics', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.BIGINT
    },
    author: {
      allowNull: false,
      type: Sequelize.STRING
    },
    articleSlug: {
      allowNull: false,
      type: Sequelize.STRING
    },
    readCount: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  }),
  down: queryInterface => queryInterface.dropTable('Statistics')
};
