const SequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const sequelize = require("../utils/dbConfig");

const Course = sequelize.define('courses',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false, 
    }
    ,
    num_chapters:{
        type: DataTypes.INTEGER,
        allowNull: false, 
    }
});

SequelizePaginate.paginate(Course);
module.exports = Course;