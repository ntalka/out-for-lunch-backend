const Sequelize = require('sequelize');
const Database = require('../util/database');
const { Model } = Sequelize;
class User extends Model {}
User.init(
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

    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    authToken: {
      field: 'auth_token',
      type: Sequelize.TEXT,
      allowNull: false,
    },
    verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
    },

    officeId: {
      field: 'office_id',
      type: Sequelize.INTEGER,
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
    modelName: 'User',
    tableName: 'users',
    freezeTableName: true,
    timestamps: true,
    paranoid: true,
  }
);

User.associate = ({ Office }) => {
  User.belongsTo(Office, {
    foreignKey: 'office_id',
    as: 'office',
  });
};

module.exports = { User };
