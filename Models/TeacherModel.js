const SequelizePaginate = require('sequelize-paginate');
const { DataTypes } = require('sequelize');
const sequelize = require("../utils/dbConfig");
const bcrypt = require("bcrypt");

const User = sequelize.define('users',{
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
    role:{
        type: DataTypes.STRING,
        allowNull: false, 
    }
    ,
    password:{
        type: DataTypes.STRING,
        allowNull: false, 
    }
    ,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, 
        validate: {
            isEmail: true 
        }
    }
});

User.prototype.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};


SequelizePaginate.paginate(User);
module.exports = User;