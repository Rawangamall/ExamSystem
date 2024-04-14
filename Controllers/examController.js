const { fetchAllQuestion } = require('./questionController');
const {Exam} = require("./../Models/association")
const CatchAsync = require('./../utils/CatchAsync');

exports.CreateExam = CatchAsync(async(req,res,next)=>{
 const {total_questions,questions_ch,simple,difficult,reminding,understanding,creativity,courseID} = req.body
 //Create

 const exam = await Exam.create({
    total_questions: total_questions,
    questions_ch: questions_ch,  //[{chapterID , NumQuestions}]
    difficult :{difficult:difficult , simple:simple},
    objectives:{
        reminding: reminding,
        understanding:understanding,
        creativity: creativity
    },
    course_id :courseID 
 })

const population =await fetchQuestions(exam )
const fitnessScores = population.map(examConfig => {
    return calculateFitness(examConfig, {
        simpleRatio: simple / total_questions,
        difficultRatio: difficult / total_questions,
        objectiveRatios: {
            reminding: reminding / total_questions,
            understanding: understanding / total_questions,
            creativity: creativity / total_questions
        }
    });
});

console.log("Fitness scores:", fitnessScores);

res.status(200).json({ population, fitnessScores });
});

async function fetchQuestions(exam) {
    try {
        const response = await fetchAllQuestion(exam.course_id);
        const questions = response.data;
        const questionsCount = response.totalQuestions;

        if (questionsCount < exam.total_questions) {
            throw new Error('Not enough questions available');
        }

        const populationSize = 4;
        const initialPopulation = initializePopulation(questions, populationSize, exam);
        return initialPopulation;

    } catch (error) {
        console.error('Error fetching questions:', error.message);
        throw error;
    }
}


function initializePopulation(questions,populationSize, exam) {
    /*
  Terms: questions => all question of specific course
       availableQuestions => questions of choosen chapters in the course according to teacher needs
       selectedQuestions => the random questions selected to build exam versions 
    */

    const population = [];
    const totalQuestionsNeeded = populationSize * exam.total_questions;

    if (questions.length < totalQuestionsNeeded) {
        throw new Error('Not enough questions available to create exam configurations');
    }

    for (let i = 0; i < populationSize; i++) {
        const examConfiguration = [];
        
        // for each chapter select number of random questions 
        exam.questions_ch.forEach(chapter => {
            const chapterID = chapter.chapterID;
            const selectedQuestions = [];
            const availableQuestions = questions.filter(question => question.chapter_id === chapterID);

            if (availableQuestions.length < chapter.NumQuestions) {
                throw new Error(`Not enough questions available for chapter ${chapterID}`);
            }

            // Randomly select questions from the chapter
            for (let j = 0; j < chapter.NumQuestions; j++) {
                const randomIndex = Math.floor(Math.random() * availableQuestions.length);
                selectedQuestions.push(availableQuestions[randomIndex]);
                availableQuestions.splice(randomIndex, 1); // remove selected question to avoid duplicates
            }
            
            examConfiguration.push(...selectedQuestions);
        });

        population.push(examConfiguration);
    }

    return population;
}

function calculateFitness(examConfiguration, criteria) {
    const { simpleRatio, difficultRatio, objectiveRatios } = criteria;
    const totalQuestions = examConfiguration.length;
  
    // difficulty level counts
    const difficultyCounts = examConfiguration.reduce((counts, question) => {
      counts[question.difficulty] = (counts[question.difficulty] || 0) + 1;
      return counts;
    }, {});
  
    // objective level counts
    const objectiveCounts = examConfiguration.reduce((counts, question) => {
      counts[question.objective] = (counts[question.objective] || 0) + 1;
      return counts;
    }, {});
    
  console.log("difficultyCounts:",difficultyCounts,"objectiveCounts:",objectiveCounts)
    // Calculate actual ratios
    const simpleRatioActual = difficultyCounts.simple / totalQuestions;
    const difficultRatioActual = difficultyCounts.difficult / totalQuestions;
    const objectiveRatiosActual = Object.keys(objectiveRatios).reduce((obj, objective) => {
      obj[objective] = objectiveCounts[objective] / totalQuestions;
      return obj;
    }, {});
  
    const normalizeDifference = diff => Math.min(diff, 1); // normalize between 0 and 1
  
    // Calculate (weighted)
    const weightDifficulty = 0.5;
    const difficultyScore = weightDifficulty * normalizeDifference(Math.abs(simpleRatioActual - simpleRatio)) + weightDifficulty * normalizeDifference(Math.abs(difficultRatioActual - difficultRatio));
  
    const weightObjective = 0.5;
    const objectiveScore = weightObjective * Object.keys(objectiveRatios)
      .reduce((score, objective) => score + normalizeDifference(Math.abs(objectiveRatiosActual[objective] - objectiveRatios[objective])), 0);
  
    // Combine scores
    return 1 / (1 + difficultyScore + objectiveScore);
  }
  
  