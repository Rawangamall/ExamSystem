const { body, param } = require("express-validator");
const {Course} = require("./../../Models/association");

const parseJsonArray = (value) => {
        const jsonString = value.replace(/([{,])(\s*)([A-Za-z0-9_\-]+?)\s*:/g, '$1"$3":');
        const parsedValue = JSON.parse(jsonString);

        if (Array.isArray(parsedValue)) {
            return parsedValue;
        } else {
            return [];
        }
};

const parseIntBody = (req, res, next) => {
    // Parse integer fields
    req.body.total_questions = parseInt(req.body.total_questions);
    req.body.simple = parseInt(req.body.simple);
    req.body.difficult = parseInt(req.body.difficult);
    req.body.reminding = parseInt(req.body.reminding);
    req.body.understanding = parseInt(req.body.understanding);
    req.body.creativity = parseInt(req.body.creativity);

    // Return the modified request body
    return next();
};


exports.postValidation = [
    parseIntBody,
body("total_questions").isNumeric().withMessage("You should enter the total questions in exam"),
body('questions_ch').customSanitizer(parseJsonArray), // Use custom sanitizer
body("questions_ch").isArray().withMessage("You should enter the total questions per chapter as an array"),
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
body().custom((value, { req }) => {
   // console.log(typeof(req.body.questions_ch))
    const questionsCh = req.body.questions_ch;
        const totalQuestions = req.body.total_questions;
        const questionsPerChapter = questionsCh.reduce((total, chapter) => total + chapter.NumQuestions, 0);
        const totalObjectives = req.body.reminding + req.body.understanding + req.body.creativity;
        const totalDifficulty = req.body.simple + req.body.difficult;

        if (totalQuestions !== totalObjectives || totalQuestions !== totalDifficulty || totalQuestions !== questionsPerChapter) {
            throw new Error("Total questions should be equal to the sum of questions per chapter, total difficulty, and total objectives.");
        }

        return true;
    }),
]
