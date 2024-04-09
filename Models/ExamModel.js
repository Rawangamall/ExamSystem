const SequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const sequelize = require("../utils/dbConfig");

const difficulty = {
    simple: 0,
    difficult: 1,
  };
  
  
const Exam = sequelize.define('exams',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_questions:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    questions_ch:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    difficult: DataTypes.JSON,
    objectives: DataTypes.JSON
});

SequelizePaginate.paginate(Exam);
module.exports = Exam;