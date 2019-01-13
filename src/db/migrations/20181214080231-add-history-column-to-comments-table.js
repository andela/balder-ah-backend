export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'history', {
    type: Sequelize.ARRAY(Sequelize.JSON),
    allowNull: true,
    defaultValue: []
  }),
  down: queryInterface => queryInterface.removeColumn('Comments', 'history')
};
