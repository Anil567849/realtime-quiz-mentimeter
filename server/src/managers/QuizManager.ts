import { AllowedSubmissions, Quiz } from "../Quiz";
let globalProblemId = 0;

interface Pro {
    title: string;
    description: string;
    image?: string;
    options: {
        id: number;
        title: string;
    }[];
    answer: AllowedSubmissions;
}


export class QuizManager {

    private quizes: Quiz[];
    constructor() {
        this.quizes = [];
    }

    addUser(roomId: string, name: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz){
            return null;
        }
        const id = quiz.addUser(name);
        return id;
    }

    getCurrentState(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return {
                leaderboard: null,
                problem: null,
                type: "not_started",
            };
        }
        return quiz.getCurrentState();
    }

    addQuiz(roomId: string) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz(roomId);
        this.quizes.push(quiz);
    }

    public addProblem(roomId: string, problem: Pro) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.addProblem({
            ...problem, // title, description, options, answer
            id: (globalProblemId++).toString(),
            startTime: new Date().getTime(),
            submissions: [],
        });
    }

    public next(roomId: string) {
        const quiz = this.getQuiz(roomId);
        if(!quiz) {
            return;
        }
        quiz.next();
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmissions) {
        this.getQuiz(roomId)?.submit(userId, roomId, problemId, submission);   
    }

    private getQuiz(roomId: string) {
        // In this code, if the .find() method doesn't find a matching quiz and returns undefined, the ?? operator will return null instead.
        // The ?? is the nullish coalescing operator in JavaScript.
        return this.quizes.find(x => x.roomId === roomId) ?? null;
    }

}