const { fetchAllQuestion } = require('./questionController');
const {Exam} = require("./../Models/association")
const CatchAsync = require('./../utils/CatchAsync');

exports.CreateExam = CatchAsync(async(req,res,next)=>{
 const {total_questions,questions_ch,simple,difficult,reminding,understanding,creativity,courseID} = req.body
 //Create

 const exam = await Exam.create({
    total_questions: total_questions,
    questions_ch: questions_ch,
    difficult :{difficult:difficult , simple:simple},
    objectives:{
        reminding: reminding,
        understanding:understanding,
        creativity: creativity
    },
    course_id :courseID 
 })

 const populationSize = 4;
const population =await fetchQuestions(populationSize, exam.total_questions ,exam.course_id )
   res.status(200).json({population})
});

function initializePopulation(questions, populationSize, questionsPerExam) {
    const population = [];
    for (let i = 0; i < populationSize; i++) {
        const examConfiguration = [];
        for (let j = 0; j < questionsPerExam; j++) {
            const randomIndex = Math.floor(Math.random() * questions.length);
            examConfiguration.push(questions[randomIndex]);
        }
        population.push(examConfiguration);
    }
    return population;
}

async function fetchQuestions(populationSize, questionsPerExam , courseID) {
    try {
        const response = await fetchAllQuestion(courseID);
        const questions = response.data;
        const questionsCount = response.totalQuestions;

        if (questionsCount < populationSize * questionsPerExam) {
            throw new Error('Not enough questions available');
        }

        const initialPopulation = initializePopulation(questions, populationSize, questionsPerExam);
        return initialPopulation;

    } catch (error) {
        console.error('Error fetching questions:', error.message);
        throw error;
    }
}

