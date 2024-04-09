const { body, param } = require("express-validator");
const {Chapter , Course} = require("./../../Models/association")


const postValidation = [
body("name").isString().withMessage("You should enter valid name in letters only!")
            .custom(async (value,req) => {
            const courseID = req.body.courseID
            const existName = await Chapter.findOne({ where: { name:value , course_id:courseID} })
            if(existName){
                throw new Error("This chapter is already exist in that course")
            }
            return true
        }),
body("courseID").custom(async (value,req) => {
    const existName = await Course.findOne({ where:{id:value} })
    if(!existName){
        throw new Error("This course isn't exist")
    }
    return true
}),
]

const patchValidation = [
body("name").isString().withMessage("You should enter valid name in letters only!")
    .custom(async (value,req) => {
    const courseID = req.body.courseID
    const existName = await Chapter.findOne({ where: { name:value , course_id:courseID} })
    if(existName){
        throw new Error("This chapter is already exist in that course")
    }
    return true
}).optional(),
body("courseID").custom(async (value,req) => {
    const existName = await Course.findOne({ where:{id:value} })
    if(!existName){
    throw new Error("This course isn't exist")
    }
    return true
    }).optional(),
]