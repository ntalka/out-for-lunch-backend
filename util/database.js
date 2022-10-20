/*const mysql = require('mysql2');
require ("dotenv").config();

let db_con  = mysql.createConnection({

host: process.env.db_host,
user: process.env.db_user,
database:process.env.db_database,
password: process.env.db_password

});*/

require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.db_database,
  process.env.db_user,
  process.env.db_password,
  {
    dialect: 'mysql',
    host: process.env.db_host,
    port: process.env.db_port,
  }
);

/*db_con.connect((err) => {
  if (err) {
    console.log("Database Connection Failed !!!", err);
  } else {
    console.log("connected to Database");
    
    
    var user_table = "CREATE TABLE IF NOT EXISTS users (id INT PRIMARY KEY Auto_Increment, name VARCHAR(255), email VARCHAR(255), password VARCHAR(255), auth_token TEXT, verified TINYINT )"; 
    db_con.query(user_table, function (err, result) {  
      if (err) throw err;  
      console.log("user Table created");  
      }); 
    
    var restaurant_table = "CREATE TABLE IF NOT EXISTS restaurants (id INT PRIMARY KEY Auto_Increment, name VARCHAR(255), location VARCHAR(255))"; 
    db_con.query(restaurant_table, function (err, result) {  
      if (err) throw err;  
      console.log("restaurant Table created");  
      });
      
    var groups_table = "CREATE TABLE IF NOT EXISTS user_groups (id INT PRIMARY KEY Auto_Increment, time DATETIME)"; 
    db_con.query(groups_table, function (err, result) {  
        if (err) throw err;  
        console.log("groups Table created");  
        });

    var groupmembers_table = "CREATE TABLE IF NOT EXISTS group_members (userId INT , groupId INT, FOREIGN KEY (userId) REFERENCES users(id) , FOREIGN KEY (groupId) REFERENCES user_groups(id), PRIMARY KEY(userId, groupId))"; 
    db_con.query(groupmembers_table, function (err, result) {  
          if (err) throw err;  
          console.log("groupmembers Table created");  
          });

    var office_table = "CREATE TABLE IF NOT EXISTS office (id INT PRIMARY KEY Auto_Increment, name VARCHAR(255), location VARCHAR(255))"; 
          db_con.query(office_table, function (err, result) {  
                if (err) throw err;  
                console.log("office Table created");  
                });




  }
});*/

// module.exports = db_con;
module.exports = sequelize;
