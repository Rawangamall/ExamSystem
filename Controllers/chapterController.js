const {Chapter , Question} = require("./../Models/association")
const CatchAsync = require("./../utils/CatchAsync")

exports.createChapter = CatchAsync(async (req,res,next)=>{
    const name = req.body.name
    const courseID = req.body.courseID

    const Chapter = await Chapter.findOrCreate({
        where: { name: name },
        defaults: {
            course_id: courseID
        }
      });

      if(!Chapter){
        res.status(400).json({message:"Failed to create new Chapter"})
      }
    res.status(200).json({data:Chapter});
})

exports.getOneChapter = CatchAsync(async (req, res, next) => {
        const ChapterID = req.params.id;
        const Chapter = await Chapter.findOne({ 
            where: { id: ChapterID },
            include: [{ model: Question, as: 'questions' }] 
        });
        
        if (!Chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        
        res.status(200).json({data:Chapter});
    });


exports.getAllChapter = CatchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Chapter.findAndCountAll({
        where: {
          name: {
            [Op.like]: searchKey
          }
        },
        include: [{ model: Question, as: 'questions' }] ,
        offset: offset,
        limit: limit
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
    const courseID = parseInt(req.body?.course_id);

    const Chapter = await Chapter.findByPk(id);
    if (!Chapter) {
        res.status(404).json({message:`Chapter not found`});
    }  
    if (name) {
        Chapter.name = name;
    }
    if (courseID) {
        Chapter.course_id = courseID;
    }

    await Chapter.save();
    res.status(200).json({ message: 'Chapter updated successfully',data: Chapter });

})

exports.delChapter = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const Chapter = await Chapter.findByPk(id);
  
    if (!Chapter) {
        res.status(404).json({message:`Chapter not found`});
    }
  
    await Chapter.destroy();
    res.status(200).json({ message: 'Chapter deleted successfully' });
})