const { Question , Chapter ,Course} = require("./../Models/association")
const { Op} = require("sequelize");

const CatchAsync = require("./../utils/CatchAsync")

exports.createQuestion = CatchAsync(async (req,res,next)=>{
    const { text ,choice1 ,choice2,choice3 ,difficulty,objective} = req.body;
    const correct_choice = parseInt(req.body?.correct_choice);
    const chapterID = parseInt(req.body?.chapterID)

    const chapter = await Chapter.findByPk(chapterID);
    if (!chapter) {
        return res.status(404).json({ message: "chapter not found" });
    }

    const [question, created] = await Question.findOrCreate({
        where: { text: text, chapter_id: chapterID }, 
        defaults: {
            text: text,
            choice1: choice1,
            choice2: choice2,
            choice3: choice3,
            difficulty: difficulty,
            objective: objective,
            correct_choice: correct_choice,
            chapter_id: chapterID
        }
    });
    

      if(!created){
        res.status(400).json({message:"Failed to create new Question might be exist!"})
      }
    res.status(200).json({data:question});
})

exports.getOneQuestion = CatchAsync(async (req, res, next) => {
        const QuestionID = req.params.id;
        const question = await Question.findOne({ 
            where: { id: QuestionID }
        });
        
        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }
        
        res.status(200).json({data:question});
    });


exports.getAllQuestion = CatchAsync(async (req,res,next)=>{
    const searchKey = req.body.searchKey || ""
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Question.findAndCountAll({
        where: {
          text: {
            [Op.like]: `%${searchKey}%`
          }
        },
        offset: offset,
        limit: limit
      });

      
    if (rows.length == 0) {
        return res.status(404).json({ message: "No Question found" });
    }
    
    res.status(200).json({
         data:rows ,
         totalQuestions:count,
         currentPage: page,
         totalPages: Math.ceil(count / limit),
        });
})


exports.fetchAllQuestion = async (courseID)=>{
    const course = await Course.findByPk(courseID, {
        include: [{ model: Chapter, as: 'chapters' }]
    });

    if (!course) {
        throw new Error('Course not found');
    }

    const chapterIds = course.chapters.map(chapter => chapter.id);
    const { count, rows } = await Question.findAndCountAll({ 
        where: {chapter_id: chapterIds}
    });

    if (rows.length == 0) {
        throw new Error("No Question found");
    }
    return {
        data: rows,
        totalQuestions: count,
    };
}

exports.updateQuestion = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const chapterID = parseInt(req.body?.chapterID);
    const question = await Question.findByPk(id);

    if (!question) {
        res.status(404).json({message:`Question not found`});
    }  
    if (chapterID) {
        const chapter = await Chapter.findByPk(chapterID);
        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }
        question.chapter_id = chapterID;
    }
    
    Object.keys(req.body).forEach(field => {
       
        if (question[field] !== undefined) {
            question[field] = req.body[field];
        } 
    });
    
     const newquestion = await question.save();
    res.status(200).json({ message: 'Question updated successfully',data: newquestion });

})

exports.delQuestion = CatchAsync(async (req,res,next)=>{
    const id = req.params.id;
    const question = await Question.findByPk(id);
  
    if (!question) {
        res.status(404).json({message:`Question not found`});
    }
  
    await question.destroy();
    res.status(200).json({ message: 'Question deleted successfully' });
})