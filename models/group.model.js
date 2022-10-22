const Sequelize = require('sequelize');
const {
  Model
} = Sequelize;
const Database = require('../config/config');
class Group extends Model {}
Group.init({
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
  deletedAt: {
    type: Sequelize.DATE,
    field: 'deleted_at',
  },
}, {
  sequelize: Database,
  modelName: 'Group',
  tableName: 'groups',
  freezeTableName: true,
  timestamps: true,
  paranoid: true,
});

Group.associate = ({
  Office,
  Restaurant,
  GroupMember
}) => {
  Group.belongsTo(Office, {
    foreignKey: 'office_id',
    as: 'office',
  });

  Group.belongsTo(Restaurant, {
    foreignKey: 'restaurant_id',
    as: 'restaurant',
  });

  Group.hasMany(GroupMember, {
    foreignKey: 'group_id',
    sourceKey: 'id',
    as: 'groupMember'
  })
};

module.exports = Group;