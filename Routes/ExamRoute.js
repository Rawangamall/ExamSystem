const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

const {postValidation , patchValidation} = require("./../Core/Validations/exam");
const validateMW = require("./../Middleware/validateMW");
const auth = require("./../Middleware/authenticationMW")
const authorize = require("./../Middleware/authorizationMW")

const examController = require("./../Controllers/examController");
 
router.route("/exams")
       .post(Upload.none(),postValidation,validateMW,examController.CreateExam)

module.exports=router