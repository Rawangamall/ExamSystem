const SequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const sequelize = require("../utils/dbConfig");
  
const Question = sequelize.define('questions',{
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    text:{
        type: DataTypes.STRING,
        allowNull: false
    }
    ,
    choice1:{
        type: DataTypes.STRING,
        allowNull: false
    }
    ,
    choice2:{
        type: DataTypes.STRING,
        allowNull: false
    }
    ,
    choice3:{
        type: DataTypes.STRING,
        allowNull: false
    }
    ,
    correct_choice:{
        type: DataTypes.INTEGER,
        allowNull: false, 
        validate: {
          isIn: {
            args: [Object.values([0,1,2])],
            msg: "Invalid correct choice value"
          }
        }
    },
    difficulty: {
        type: DataTypes.ENUM(["simple","difficult"]),
        allowNull: false
      }
    ,
    objective:{
        type: DataTypes.ENUM(["reminding","understanding","creativity"]),
        allowNull: false
    }
});

SequelizePaginate.paginate(Question);
module.exports = Question;