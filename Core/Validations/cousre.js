const { body, param } = require("express-validator");
const {Course} = require("./../../Models/association")


exports.postValidation = [
body("name").isString().withMessage("You should enter valid name in letters only!")
            .custom(async (value) => {

                if (!/^[a-zA-Z ]+$/.test(value)) {
                    throw new Error("Name should contain only letters");
                }
            const existName = await Course.findOne({ where: { name: value } })
            if(existName){
                throw new Error("This course is already exist in the system")
            }
            return true
        }),
body("num_chapters").isNumeric().withMessage("enter valid number of chapters of that course")
]

exports.patchValidation = [
body("name").isString().withMessage("You should enter valid name in letters only!")
            .custom(async (value) => {
                if (!/^[a-zA-Z ]+$/.test(value)) {
                    throw new Error("Name should contain only letters");
                }
            const existName = await Course.findOne({ where: { name: value } })
            if(existName){
                throw new Error("This course is already exist in the system")
            }
            return true
        }).optional(),
body("num_chapters").isNumeric().withMessage("enter valid number of chapters of that course").optional()
]