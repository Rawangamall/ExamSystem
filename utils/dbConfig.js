const Sequelize = require('sequelize');
const path=require("path"); 
require("dotenv").config({ path: "config.env" });

const sequelize = new Sequelize(
  "exam",
  "root", 
  "",
  {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
      charset: 'utf8mb4',
    },
  }
);


sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err.message);
  });
  
module.exports = sequelize;
