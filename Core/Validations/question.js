const { body, param } = require("express-validator");
const {Chapter , Question} = require("./../../Models/association")


const postValidation = [
body("question").isString().withMessage("You should enter valid question in letters!")
            .custom(async (value,req) => {
            const chapterID = req.body.chapterID
            const existtext = await Question.findOne({ where: { text:value , chapter_id:chapterID} })
            if(existtext){
                throw new Error("This Question is already exist on that chapter")
            }
            return true
        }),
body("choice1").isString().withMessage("You should enter valid answer in letters!"),
body("choice2").isString().withMessage("You should enter valid answer in letters!"),
body("choice3").isString().withMessage("You should enter valid answer in letters!"),
body("correct_choice").isNumeric().withMessage("You should choose correct answer between the three choices")
    .custom((value) => {
        if (![0, 1, 2].includes(parseInt(value))) {
            throw new Error('Correct choice must be 0, 1, or 2');
        }
        return true;
    }),
body('difficulty').isIn(['simple', 'difficult']).withMessage('Difficulty must be either "simple" or "difficult"'),
body('objective').isIn(['reminding', 'understanding', 'creativity']).withMessage('Objective must be one of "reminding", "understanding", or "creativity"'),
body("chapterID").custom(async (value) => {
    const existName = await Chapter.findOne({ where:{id:value} })
    if(!existName){
        throw new Error("This chapter isn't exist")
    }
    return true
}),
]

const patchValidation = [
body("question").isString().withMessage("You should enter valid question in letters!")
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