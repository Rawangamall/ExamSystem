const { fetchAllQuestion } = require('./questionController');
const {Exam} = require("./../Models/association")
const CatchAsync = require('./../utils/CatchAsync');


exports.CreateExam = CatchAsync(async (req, res, next) => {

    const { total_questions, questions_ch, simple, difficult, reminding, understanding, creativity, courseID } = req.body;
  
    // Create exam
    const exam = await Exam.create({
      total_questions,
      questions_ch, // [{chapterID , NumQuestions}]
      difficult: { difficult, simple },
      objectives: { reminding, understanding, creativity },
      course_id: courseID,
    }); 
  
    let { population, availableQuestions } = await fetchQuestions(exam);
    let fitnessScores =[];
    let fittestExam;
    let fittestIndex;
    const maxGenerations = 500;
    const mutationRate = 0.2;
    const numBestIndividuals = 2;
    const tournamentSize =3
    let generation = 0;
    let terminationConditionMet = false;
    const teacherCriteria = {
        simpleRatio: simple / total_questions,
        difficultRatio: difficult / total_questions,
        objectiveRatios: {
          reminding: reminding / total_questions,
          understanding: understanding / total_questions,
          creativity: creativity / total_questions
        }
      }

      while (!terminationConditionMet && generation < maxGenerations) {  
      // Calculate fitness scores
      fitnessScores = population.map(examConfig =>
        calculateFitness(examConfig, teacherCriteria)
      );
      // paraent election 
     // const parents = rouletteWheelSelection(population, fitnessScores);
     const parents = tournamentSelection(population, fitnessScores, tournamentSize);

      const [child1, child2] = singlePointCrossover(parents[0].configuration, parents[1].configuration);

      const mutatedChildren = mutate([child1, child2], mutationRate, availableQuestions);

      // fitness scores again for mutated children
      const mutatedFitnessScores = mutatedChildren.map(examConfig =>
        calculateFitness(examConfig, teacherCriteria)
      );

      // Combine mutated children with best individuals
      const bestIndividuals = selectBestFromPopulation(population, fitnessScores, numBestIndividuals);
      population = [...mutatedChildren, ...bestIndividuals];

      // Update fitness scores with mutated children
      fitnessScores = [...mutatedFitnessScores, ...fitnessScores.slice(0, numBestIndividuals)];
      fittestIndex = fitnessScores.indexOf(Math.max(...fitnessScores));
      fittestExam = population[fittestIndex];

      terminationConditionMet = checkTerminationCondition(fittestExam, teacherCriteria);

      generation++;
    }
    res.status(200).json({ fittestExam , perecntage: 100 * Math.max(...fitnessScores)});
});

function checkTerminationCondition(examConfig, criteria) {
    const fitnessScore = calculateFitness(examConfig, criteria);
    return fitnessScore >= 0.9; // threshold
  }
  
  
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
    let availableQuestions=[]
    if (questions.length < totalQuestionsNeeded) {
        throw new Error('Not enough questions available to create exam configurations');
    }

    for (let i = 0; i < populationSize; i++) {
        const examConfiguration = [];
        
        // for each chapter select number of random questions 
        exam.questions_ch.forEach(chapter => {
            const chapterID = chapter.chapterID;
            const selectedQuestions = [];
             availableQuestions = questions.filter(question => question.chapter_id === chapterID);

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

    return {population,availableQuestions};
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

    // Calculate actual ratios
    const simpleRatioActual = difficultyCounts.simple / totalQuestions || 0;
    const difficultRatioActual = difficultyCounts.difficult / totalQuestions || 0;
    const objectiveRatiosActual = Object.keys(objectiveRatios).reduce((obj, objective) => {
      obj[objective] = objectiveCounts[objective] / totalQuestions || 0;
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
  
  function tournamentSelection(population, fitnessScores, tournamentSize) {
    const selectedParents = [];
  
    while (selectedParents.length < 2) {
        const tournamentParticipants = [];
        for (let i = 0; i < tournamentSize; i++) {
            const randomIndex = Math.floor(Math.random() * population.length);
            tournamentParticipants.push({ configuration: population[randomIndex], score: fitnessScores[randomIndex] });
        }
      
        tournamentParticipants.sort((a, b) => b.score - a.score);      
        selectedParents.push(tournamentParticipants[0]);
    }
  
    return selectedParents;
}
  
function selectBestFromPopulation(population, fitnessScores, numToRetain=2) {

    const sortedPopulation = population.map((config, index) => ({ config, index }))
      .sort((a, b) => fitnessScores[b.index] - fitnessScores[a.index]);

      return sortedPopulation.slice(0, numToRetain).map(individual => individual.config);
  }
  
  function singlePointCrossover(parent1, parent2) {
    // random crossover point
    const crossoverPoint = Math.floor(Math.random() * (parent1.length - 1)) + 1;
  
    //  swapping questions in crossover point
    const child1 = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    const child2 = parent2.slice(0, crossoverPoint).concat(parent1.slice(crossoverPoint));
  
    return [child1, child2];
  }


function mutate(children, mutationRate, availableQuestions) {
    const mutatedChildren = [];
  
    for (const childConfig of children) {
        if (Math.random() < mutationRate) {
            const mutatedChild = [];

            for (const question of childConfig) {
                if (Math.random() < mutationRate) {                                              //same chapter but diff ques in the exam
                    const chapterQuestions = availableQuestions.filter(q => q.chapterID === question.chapterID && !childConfig.some(childQuestion => childQuestion.id === q.id));
                    
                    if (chapterQuestions.length > 0) {
                        const randomQuestionIndex = Math.floor(Math.random() * chapterQuestions.length);
                        const newQuestion = chapterQuestions[randomQuestionIndex];
                        mutatedChild.push(newQuestion);
                    } else {
                        mutatedChild.push(question); // no suitable question found
                    }
                } else {
                    mutatedChild.push(question); // no mutation
                }
            }

            mutatedChildren.push(mutatedChild);
        } else {
            mutatedChildren.push(childConfig); // no mutation
        }
    }

    return mutatedChildren;
}
