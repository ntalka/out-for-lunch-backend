const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const offices= sequelize.define('offices', {

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

    location:{
        type: Sequelize.STRING,
        allowNull: false
    
    }



    
});
module.exports = offices;