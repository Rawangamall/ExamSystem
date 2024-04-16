const Teacher = require("./../Models/TeacherModel")
const { Op} = require("sequelize");
const bcrypt = require("bcrypt");

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds)


const CatchAsync = require("./../utils/CatchAsync")

exports.createTeacher = CatchAsync(async (req,res,next)=>{
    const {name,email,role} = req.body
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    const [Teacher, created]= await Teacher.findOrCreate({
        where: { email: email},
        default:{
            name:name,
            email:email,
            role:role,
            password:hashedPassword
          }
      });

      if(!created){
        res.status(400).json({message:"Failed to create new Teacher might be exist!"})
      }

    res.status(200).json({data:Teacher});
})

exports.getOneTeacher = CatchAsync(async (req, res, next) => {
        const TeacherID = req.params.id;
        const Teacher = await Teacher.findOne({ 
            where: { id: TeacherID }
        }).select("-password");
        
        if (!Teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        
        res.status(200).json({data:Teacher});
    });


exports.getAllTeacher = CatchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Teacher.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${searchKey}%`
          }
        },
        offset: offset,
        limit: limit
      }).select("-password");

      
    if (rows.length == 0) {
        return res.status(404).json({ message: "No Teacher found" });
    }
    
    res.status(200).json({
         data:rows ,
         totalTeachers:count,
         currentPage: page,
         totalPages: Math.ceil(count / limit),
        });
})

exports.updateTeacher = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const hashedPassword = await bcrypt.hash(request.body.password, salt);

    const Teacher = await Teacher.findByPk(id);
    if (!Teacher) {
        res.status(404).json({message:`Teacher not found`});
    }  

    Object.keys(req.body).forEach(field => {
        if (Teacher[field] !== undefined) {
            if (field === 'password' && req.body.password) {
                Teacher[field] = hashedPassword;
            } else {
                Teacher[field] = req.body[field];
            }
        } 
    });
        
    await Teacher.save();
    res.status(200).json({ message: 'Teacher updated successfully',data: Teacher });

})

exports.delTeacher = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const Teacher = await Teacher.findByPk(id);
  
    if (!Teacher) {
        res.status(404).json({message:`Teacher not found`});
    }
  
    await Teacher.destroy();
    res.status(200).json({ message: 'Teacher deleted successfully' });
})