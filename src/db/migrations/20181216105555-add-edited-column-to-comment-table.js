export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'edited', {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }),

  down: queryInterface => queryInterface.removeColumn('Comments', 'edited')
};
