const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const offices = require('./offices'); 
const users= sequelize.define('users', {

    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name:{
        type: Sequelize.STRING,
        allowNull: false
    },

    email:{
        type: Sequelize.STRING,
        allowNull: false
    },

    password:{
        type: Sequelize.STRING,
        allowNull: false
    },
    auth_token:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    verified:{
        type: Sequelize.BOOLEAN,
        //allowNull: false,
        defaultValue:0

    },

    officeId:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },

    



    
});


users.belongsTo(offices, {
    foreignKey: "officeId",
    as:'office'
  });

  module.exports = users;