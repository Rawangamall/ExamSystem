const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

const {postValidation , patchValidation} = require("./../Core/Validations/cousre");
const validateMW = require("./../Middleware/validateMW");
const auth = require("./../Middleware/authenticationMW")
const authorize = require("./../Middleware/authorizationMW")

const CourseController = require("./../Controllers/courseController");

router.route("/courses")
       .get(CourseController.getAllCourse)
       .post(postValidation,validateMW,CourseController.createCourse)

router.route("/course/:id")
       .get(CourseController.getOneCourse)
       .patch(Upload.none(),patchValidation,validateMW,CourseController.updateCourse)
        .delete(CourseController.delCourse)
module.exports=router;