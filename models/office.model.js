import Sequelize, { Model } from 'sequelize';
import Database from '../util/database';
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

export { Office };
