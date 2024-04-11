const { body, param } = require("express-validator");
const {Chapter , Course} = require("./../../Models/association")


exports.postValidation = [
    body("name").isString().withMessage("You should enter valid name in letters only!")
        .custom(async (value, { req }) => {
            const courseID = req.body.courseID;
            if (!courseID) {
                throw new Error("Choose specific course to add ch ");
            }
            const existCourse = await Course.findOne({ where:{id:courseID} })
            if(!existCourse){
                throw new Error("This course isn't exist")
            }
            const existName = await Chapter.findOne({ where: { name: value, course_id: courseID } });
            if (existName) {
                throw new Error("This chapter is already exist in that course");
            }
            return true;
      
        }),

]

exports.patchValidation = [
    body("name").isString().withMessage("You should enter valid name in letters only!")
    .custom(async (value, { req }) => {
        const ID = req.params.id;
        if (!(req.body.courseID)) {
            const ch = await Chapter.findByPk(ID)
            const existName = await Chapter.findOne({ where: { name: value, course_id: ch.course_id } });
            if (existName) {
                throw new Error("This chapter is already exist in that course");
            }
            return true;
        }else{
            const existName = await Chapter.findOne({ where: { name: value, course_id: req.body.courseID} });
            if (existName) {
                throw new Error("This chapter is already exist in that course");
            }
            return true;
        }
        
  
    }).optional(),

    body("courseID").isNumeric().withMessage("You should enter valid course!")
    .custom(async (value, { req }) => {
       
        const existch = await Course.findOne({ where: { id: value} });
        if (!existch) {
            throw new Error("This course is not exist in the system!");
        }
        return true;
  
    }).optional(),
]