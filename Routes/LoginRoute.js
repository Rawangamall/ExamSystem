const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

//const {postValidation} = require("./../Core/Validations/");
const validateMW = require("./../Middleware/validateMW");
const teacherController = require("./../Controllers/teacherController");
const loginController = require("./../Controllers/loginController");

router.route("/register")
       .post(Upload.none(),validateMW,teacherController.createTeacher) //,postValidation
 
router.route("/login")
       .post(loginController.login)
       

module.exports=router;