const Sequelize = require('sequelize');
const sequelize = require('../util/database');
var offices=require('./offices')
var restaurants=require('./restaurants')
const groups= sequelize.define('groups', {

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    time:{
        type: Sequelize.DATE,
        allowNull: false
    },

    officeId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    restaurantId:{
        type: Sequelize.STRING,
        allowNull: false,
    }



    
});

groups.belongsTo(offices, {
    foreignKey: "officeId",
    as: 'office'
  });

  groups.belongsTo(restaurants, {
    foreignKey: "restaurantId",
    as: 'restaurant'
  });


module.exports = groups;