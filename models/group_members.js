const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const groups = require('./groups');
const users = require('./users');
const group_members= sequelize.define('group_members', {

    userId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    groupId:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    }



    
});



group_members.belongsTo(users, {
    foreignKey: "userId",
    as:'user'
  });

  group_members.belongsTo(groups, {
    foreignKey: "groupId",
    as:'group'
  }); 
  
  module.exports = group_members;