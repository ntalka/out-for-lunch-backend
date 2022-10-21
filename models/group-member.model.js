import Sequelize, { Model } from 'sequelize';
import Database from '../util/database';
class GroupMember extends Model {}
GroupMember.init(
  {
    userId: {
      field: 'user_id',
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    groupId: {
      field: 'group_id',
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
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
    modelName: 'GroupMember',
    tableName: 'group_members',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

GroupMember.associate = ({ User, Group }) => {
  GroupMember.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user',
  });

  GroupMember.belongsTo(Group, {
    foreignKey: 'group_id',
    as: 'group',
  });
};

export { GroupMember };
