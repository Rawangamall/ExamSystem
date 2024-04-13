const { body, param } = require("express-validator");
const {Course} = require("./../../Models/association")


exports.postValidation = [
body("total_questions").isNumeric().withMessage("You should enter the total questions in exam"),
body("questions_ch").isArray().withMessage("You should enter the total questions per chapter"),
body('simple').isNumeric().withMessage('Simple total questions must be a number'),
body('difficult').isNumeric().withMessage('Difficult total questions must be a number'),
body('reminding').isNumeric().withMessage('Reminding objective total questions must be a number'),
body('understanding').isNumeric().withMessage('Understanding objective total questions must be a number'),
body('creativity').isNumeric().withMessage('Creativity objective total questions must be a number'),
body("courseID").custom(async (value,req) => {
    const existName = await Course.findOne({ where:{id:value} })
    if(!existName){
        throw new Error("This course isn't exist")
    }
    return true
}),
]
