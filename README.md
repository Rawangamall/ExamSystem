# ExamSystem
## System ERD:
![ERD Image](Task%20material/examDesign.jpg)

- [Use Cases](Task%20material/Use%20Cases.pdf)
- [Docs](Task%20material/Exam%20Design%20System%20Requirements.pdf)

## Genetic Algorithm steps
1. **Receive Teacher's Requirements**: The system receives the teacher's requirements, including the total number of questions, the number of questions per chapter, the difficulty level criteria, and the objective criteria.

2. **Create Exam Instance**: An exam instance is created in the database based on the received requirements.

3. **Fetch Questions**: Questions are fetched from the database based on the course associated with the exam.

4. **Generate Initial Population**: An initial population of exam configurations (each configuration representing a possible exam version) is generated. Each exam configuration consists of a set of questions distributed among the chapters according to the teacher's requirements.

5. **Calculate Fitness Scores**: The fitness score for each exam configuration in the initial population is calculated based on how well it meets the teacher's requirements. The fitness score reflects how closely the exam configuration aligns with the desired criteria.

6. **Select Parents**: The exam configurations with the highest fitness scores are selected as parents for the next generation.

7. **Generate Offspring**: Using techniques like crossover and mutation, offspring exam configurations are generated from the selected parents. This helps introduce diversity and explore new possibilities in the population.

8. **Repeat Selection and Reproduction**: Steps 5-7 are repeated iteratively for a certain number of generations or until a termination condition is met.

9. **Select Best Exam Configuration**: Once the iterations are completed, the exam configuration with the highest fitness score (i.e., the exam configuration that best meets the teacher's requirements) is selected as the final recommended exam.

10. **Return Exam Configuration**: The final recommended exam configuration is returned to the teacher for review and use.
