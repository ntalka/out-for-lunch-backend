import Sequelize, { Model } from 'sequelize';
import Database from '../util/database';
class Restaurant extends Model {}
Restaurant.init(
  {
    id: {
      type: Sequelize.INTEGER,
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
  },
  {
    sequelize: Database,
    modelName: 'Restaurant',
    tableName: 'restaurants',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

export { Restaurant };
