const SequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const sequelize = require("../utils/dbConfig");

const Chapter = sequelize.define('chapters',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false, 
    }
});

SequelizePaginate.paginate(Chapter);
module.exports = Chapter;