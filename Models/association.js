const Course = require("./CourseModel")
const Chapter = require("./ChapterModel")
const Question = require("./QuestionModel")
const Exam = require("./ExamModel")

// Set up associations
Course.hasMany(Chapter, { foreignKey: 'course_id' });
Chapter.belongsTo(Course, { foreignKey: 'course_id' });

Chapter.hasMany(Question, { foreignKey: 'chapter_id' });
Question.belongsTo(Chapter, { foreignKey: 'chapter_id' });

Course.hasMany(Exam, { foreignKey: 'course_id' });
Exam.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = { Course, Chapter ,Question,Exam };
