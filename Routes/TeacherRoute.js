const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

//const {patchValidation} = require("./../Core/Validations/");
const validateMW = require("./../Middleware/validateMW");
const auth = require("./../Middleware/authenticationMW")
const authorize = require("./../Middleware/authorizationMW")

const teacherController = require("./../Controllers/teacherController");

router.route("/teachers")
       .get(teacherController.getAllTeacher)
 
router.route("/teacher/:id")
       .get(teacherController.getOneTeacher)
       .patch(Upload.none(),validateMW,teacherController.updateTeacher)  //,patchValidation
       .delete(teacherController.delTeacher)

module.exports=router;