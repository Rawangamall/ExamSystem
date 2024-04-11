const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

const {postValidation , patchValidation} = require("../Core/Validations/question");
const validateMW = require("../Middleware/validateMW");
const auth = require("../Middleware/authenticationMW")
const authorize = require("../Middleware/authorizationMW")

const questionController = require("../Controllers/questionController");

router.route("/questions")
       .get(questionController.getAllQuestion)
       .post(Upload.none(),postValidation,validateMW,questionController.createQuestion)

router.route("/question/:id")
       .get(questionController.getOneQuestion)
       .patch(Upload.none(),patchValidation,validateMW,questionController.updateQuestion)
        .delete(questionController.delQuestion)
module.exports=router;