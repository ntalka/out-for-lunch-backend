const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const restaurants= sequelize.define('restaurants', {

    id:{
        type: Sequelize.STRING,
        // autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    name:{
        type: Sequelize.STRING,
        allowNull: false
    },


    nearbyOffice:{
        type:Sequelize.JSON,    

    }


    
});
module.exports = restaurants;