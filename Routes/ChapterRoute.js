const express=require("express");
const router=express.Router();
const multer = require("multer");
const Upload = multer();

const {postValidation , patchValidation} = require("./../Core/Validations/chapter");
const validateMW = require("./../Middleware/validateMW");
const auth = require("./../Middleware/authenticationMW")
const authorize = require("./../Middleware/authorizationMW")

const chapterController = require("./../Controllers/chapterController");

router.route("/chapters")
       .get(chapterController.getAllChapter)
       .post(postValidation,validateMW,chapterController.createChapter)
 
router.route("/chapter/:id")
       .get(chapterController.getOneChapter)
       .patch(Upload.none(),patchValidation,validateMW,chapterController.updateChapter)
       .delete(chapterController.delChapter)

module.exports=router;