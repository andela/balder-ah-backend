
export default {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'Users',
    'phoneNo', {
      type: Sequelize.BIGINT,
      allowNull: true,
      unique: true,
    }
  ),
  down: queryInterface => queryInterface.removeColumn(
    'Users',
    'phoneNo'
  ),
};
