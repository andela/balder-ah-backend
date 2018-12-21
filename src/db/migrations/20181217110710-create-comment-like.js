export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CommentReactions', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    isLiked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    likedBy: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    commentId: {
      type: Sequelize.INTEGER,
      allowNull: false
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
  down: queryInterface => queryInterface.dropTable('CommentReactions')
};
