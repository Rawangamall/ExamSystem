const {Course, Chapter , Question} = require("./../Models/association")
const { Op} = require("sequelize");

const CatchAsync = require("./../utils/CatchAsync")

exports.createChapter = CatchAsync(async (req,res,next)=>{
    const name = req.body.name
    const courseID = parseInt(req.body?.courseID)

    const course = await Course.findByPk(courseID, { include: [{ model: Chapter, as: 'chapters' }] });
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    if (course.chapters.length >= course.num_chapters) {
        return res.status(400).json({ message: "Maximum number of chapters exceeded for this course" });
    }

    const [chapter, created]= await Chapter.findOrCreate({
        where: { name: name , course_id: courseID }
      });

      if(!created){
        res.status(400).json({message:"Failed to create new Chapter might be exist!"})
      }
    res.status(200).json({data:chapter});
})

exports.getOneChapter = CatchAsync(async (req, res, next) => {
        const ChapterID = req.params.id;
        const chapter = await Chapter.findOne({ 
            where: { id: ChapterID },
            include: [{ model: Question, as: 'questions' }] 
        });
        
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        
        res.status(200).json({data:chapter});
    });


exports.getAllChapter = CatchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Chapter.findAndCountAll({
        where: {
          name: {
            [Op.like]: `%${searchKey}%`
          }
        },
        offset: offset,
        limit: limit,
        distinct:true
      });

      
    if (rows.length == 0) {
        return res.status(404).json({ message: "No Chapter found" });
    }
    
    res.status(200).json({
         data:rows ,
         totalChapters:count,
         currentPage: page,
         totalPages: Math.ceil(count / limit),
        });
})

exports.updateChapter = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const name = req.body.name;
    const courseID = parseInt(req.body?.courseID);

    const chapter = await Chapter.findByPk(id);
    if (!chapter) {
        res.status(404).json({message:`Chapter not found`});
    }  
    if (name) {
        chapter.name = name;
    }

    if (courseID) {
        const destinationCourse = await Course.findByPk(courseID, { include: [{ model: Chapter, as: 'chapters' }] });
        if (!destinationCourse) {
            return res.status(404).json({ message: "Destination course not found" });
        }

        if (destinationCourse.chapters.length >= destinationCourse.num_chapters) {
            return res.status(400).json({ message: "Cannot move chapter to the destination course; maximum number of chapters exceeded" });
        }
        chapter.course_id = courseID;
    }

    
    await chapter.save();
    res.status(200).json({ message: 'Chapter updated successfully',data: chapter });

})

exports.delChapter = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const chapter = await Chapter.findByPk(id);
  
    if (!chapter) {
        res.status(404).json({message:`Chapter not found`});
    }
  
    await chapter.destroy();
    res.status(200).json({ message: 'Chapter deleted successfully' });
})