"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
const Quiz_1 = require("../Quiz");
let globalProblemId = 0;
class QuizManager {
    constructor() {
        this.quizes = [];
    }
    addUser(roomId, name) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return null;
        }
        const id = quiz.addUser(name);
        return id;
    }
    getCurrentState(roomId) {
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
    addQuiz(roomId) {
        if (this.getQuiz(roomId)) {
            return;
        }
        const quiz = new Quiz_1.Quiz(roomId);
        this.quizes.push(quiz);
    }
    addProblem(roomId, problem) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.addProblem(Object.assign(Object.assign({}, problem), { id: (globalProblemId++).toString(), startTime: new Date().getTime(), submissions: [] }));
    }
    next(roomId) {
        const quiz = this.getQuiz(roomId);
        if (!quiz) {
            return;
        }
        quiz.next();
    }
    submit(userId, roomId, problemId, submission) {
        var _a;
        (_a = this.getQuiz(roomId)) === null || _a === void 0 ? void 0 : _a.submit(userId, roomId, problemId, submission);
    }
    getQuiz(roomId) {
        var _a;
        // In this code, if the .find() method doesn't find a matching quiz and returns undefined, the ?? operator will return null instead.
        // The ?? is the nullish coalescing operator in JavaScript.
        return (_a = this.quizes.find(x => x.roomId === roomId)) !== null && _a !== void 0 ? _a : null;
    }
}
exports.QuizManager = QuizManager;
