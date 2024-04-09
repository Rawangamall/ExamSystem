const {Course , Chapter} = require("./../Models/association")
const CatchAsync = require("./../utils/CatchAsync")

exports.createCourse = CatchAsync(async (req,res,next)=>{
    const name = req.body.name
    const num_chapters = parseInt(req.body?.num_chapters)

    const course = await Course.findOrCreate({
        where: { name: name },
        defaults: {
            num_chapters: num_chapters
        }
      });

      if(!course){
        res.status(400).json({message:"Failed to create new course"})
      }
    res.status(200).json({data:course});
})

exports.getOneCourse = CatchAsync(async (req, res, next) => {
        const courseID = req.params.id;
        const course = await Course.findOne({ 
            where: { id: courseID },
            include: [{ model: Chapter, as: 'chapters' }] 
        });
        
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        res.status(200).json({data:course});
    });


exports.getAllCourse = CatchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Course.findAndCountAll({
        where: {
          name: {
            [Op.like]: searchKey
          }
        },
        include: [{ model: Chapter, as: 'chapters' }] ,
        offset: offset,
        limit: limit
      });

      
    if (rows.length == 0) {
        return res.status(404).json({ message: "No course found" });
    }
    
    res.status(200).json({
         data:rows ,
         totalCourses:count,
         currentPage: page,
         totalPages: Math.ceil(count / limit),
        });
})

exports.updateCourse = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const name = req.body.name
    const num_chapters = parseInt(req.body?.num_chapters)

    const course = await Course.findByPk(id);
    if (!course) {
        res.status(404).json({message:`course not found`});
    }  
    if (name) {
        course.name = name;
    }
    if (num_chapters) {
        course.num_chapters = num_chapters;
    }

    await course.save();
    res.status(200).json({ message: 'Course updated successfully',data: course });

})

exports.delCourse = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const course = await Course.findByPk(id);
  
    if (!course) {
        res.status(404).json({message:`course not found`});
    }
  
    await course.destroy();
    res.status(200).json({ message: 'course deleted successfully' });
})