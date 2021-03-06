export default {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: true
    },
    googleid: {
      type: Sequelize.STRING,
      allowNull: true
    },
    facebookid: {
      type: Sequelize.STRING,
      allowNull: true
    },
    twitterid: {
      type: Sequelize.STRING,
      allowNull: true
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: true
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true
    },
    isVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    emailtoken: {
      type: Sequelize.STRING,
      allowNull: true
    },
    emailNotifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    appNotifications: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    role: {
      type: Sequelize.STRING,
      defaultValue: 'user',
      allowNull: false
    }
  }),
  down: queryInterface => queryInterface.dropTable('Users')
};
