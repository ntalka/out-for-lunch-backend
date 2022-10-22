const Sequelize = require('sequelize');
const { Model } = Sequelize;
const Database = require('../config/config');
class Office extends Model {}
Office.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    location: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at',
    },
  },
  {
    sequelize: Database,
    modelName: 'Office',
    tableName: 'offices',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

module.exports = Office;
