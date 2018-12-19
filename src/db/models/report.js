export default (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      report_type: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['spam', 'harrassment', 'rules violation', 'terrorism', 'other']
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      articleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      context: DataTypes.TEXT
    },
    {}
  );
  Report.associate = (models) => {
    Report.belongsTo(models.Article, {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  };
  return Report;
};
