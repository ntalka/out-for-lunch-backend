const Sequelize = require('sequelize');
const {
  Model
} = Sequelize;
const Database = require('../config/config');
class Restaurant extends Model {}
Restaurant.init({
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },

  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  nearbyOffice: {
    field: 'nearby_office',
    type: Sequelize.JSON,
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
}, {
  sequelize: Database,
  modelName: 'Restaurant',
  tableName: 'restaurants',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
});

module.exports = Restaurant;