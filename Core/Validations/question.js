const { body, param } = require("express-validator");
const {Chapter , Question} = require("./../../Models/association")


exports.postValidation = [
body("text").isString().withMessage("You should enter valid question in letters!")
            .custom(async (value,{req}) => {
            const chapterID = req.body?.chapterID

            const existtext = await Question.findOne({ where: { text:value , chapter_id:chapterID} })
            if(existtext){
                throw new Error("This Question is already exist on that chapter")
            }
            return true
        }),
body("choice1").notEmpty().withMessage("Choice 1 cannot be empty"),
body("choice2").notEmpty().withMessage("Choice 2 cannot be empty"),
body("choice3").notEmpty().withMessage("Choice 3 cannot be empty"),
body("correct_choice").isNumeric().withMessage("You should choose correct answer between the three choices")
    .custom((value) => {
        if (![0, 1, 2].includes(parseInt(value))) {
            throw new Error('Correct choice must be 0, 1, or 2');
        }
        return true;
    }),
body('difficulty').isIn(['simple', 'difficult']).withMessage('Difficulty must be either simple or difficult as values'),
body('objective').isIn(['reminding', 'understanding', 'creativity']).withMessage('Objective must be one of (reminding, understanding, or creativity)'),
body("chapterID").custom(async (value) => {
    const existName = await Chapter.findOne({ where:{id:value} })
    if(!existName){
        throw new Error("This chapter isn't exist")
    }
    return true
}),
]

exports.patchValidation = [
body("text").isString().withMessage("You should enter valid question in letters!")
    .custom(async (value,req) => {
    const chapterID = req.body.chapterID
    const existtext = await Question.findOne({ where: { text:value , chapter_id:chapterID} })
    if(existtext){
        throw new Error("This Question is already exist on that chapter")
    }
    return true
}).optional(),
body("chapterID").custom(async (value) => {
    const existName = await Chapter.findOne({ where:{id:value} })
    if(!existName){
    throw new Error("This chapter isn't exist")
    }
    return true
}).optional(),
]