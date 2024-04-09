const Course = require("./CourseModel")
const Chapter = require("./ChapterModel")
const Question = require("./QuestionModel")
const Exam = require("./ExamModel")

// Set up associations
Course.hasMany(Chapter, { foreignKey: 'course_id' , onDelete: 'CASCADE' });
Chapter.belongsTo(Course, { foreignKey: 'course_id' , onDelete: 'CASCADE' });

Chapter.hasMany(Question, { foreignKey: 'chapter_id' , onDelete: 'CASCADE' });
Question.belongsTo(Chapter, { foreignKey: 'chapter_id' , onDelete: 'CASCADE' });

Course.hasMany(Exam, { foreignKey: 'course_id' , onDelete: 'CASCADE' });
Exam.belongsTo(Course, { foreignKey: 'course_id' , onDelete: 'CASCADE' });

module.exports = { Course, Chapter ,Question,Exam };
