import Sequelize, { Model } from 'sequelize';
import Database from '../util/database';
class Group extends Model {}
Group.init(
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },

    time: {
      type: Sequelize.DATE,
      allowNull: false,
    },

    officeId: {
      field: 'office_id',
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    restaurantId: {
      field: 'restaurant_id',
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
    modelName: 'Group',
    tableName: 'groups',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

Group.associate = ({ Office, Restaurant }) => {
  Group.belongsTo(Office, {
    foreignKey: 'office_id',
    as: 'office',
  });

  Group.belongsTo(Restaurant, {
    foreignKey: 'restaurant_id',
    as: 'restaurant',
  });
};

export { Group };
