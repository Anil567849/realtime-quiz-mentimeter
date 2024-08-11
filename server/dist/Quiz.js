"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quiz = void 0;
const IoManager_1 = require("./managers/IoManager");
const PROBLEM_TIME_S = 20;
class Quiz {
    constructor(roomId) {
        this.roomId = roomId;
        this.problems = [];
        this.activeProblem = 0;
        this.users = [];
        this.currentProblem = null;
        this.currentState = "not_started";
    }
    addUser(name) {
        const id = this.genRandonString(7);
        this.users.push({
            id,
            name,
            points: 0
        });
        return id;
    }
    addProblem(problem) {
        this.problems.push(problem);
        // console.log('problem pushed', problem)
    }
    setActiveProblem(problem) {
        this.currentState = "question";
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        this.currentProblem = problem;
        IoManager_1.IoManager.getIo().to(this.roomId).emit("problem", {
            problem
        });
        setTimeout(() => {
            this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000);
    }
    sendLeaderboard() {
        this.currentState = "leaderboard";
        const leaderboard = this.getLeaderboard();
        IoManager_1.IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard
        });
        setTimeout(() => {
            this.next();
        }, 5000);
    }
    getLeaderboard() {
        // descending order sort then return top 20
        return this.users.sort((a, b) => a.points < b.points ? 1 : -1).slice(0, 20);
    }
    next() {
        const problem = this.problems[this.activeProblem];
        this.activeProblem++;
        if (problem) {
            this.setActiveProblem(problem);
        }
        else {
            const leaderboard = this.getLeaderboard();
            IoManager_1.IoManager.getIo().to(this.roomId).emit("quiz_end", {
                leaderboard
            });
        }
    }
    getCurrentState() {
        if (this.currentState === "not_started") {
            return {
                type: "not_started",
                leaderboard: null,
                problem: null,
            };
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard(),
                problem: null,
            };
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard(),
                problem: null,
            };
        }
        if (this.currentState === "question") {
            return {
                type: "question",
                problem: this.currentProblem,
                leaderboard: null,
            };
        }
    }
    submit(userId, roomId, problemId, submission) {
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id === userId);
        if (!problem || !user) {
            console.log("problem or user not found");
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
        if (existingSubmission) {
            console.log("submissions exist");
            return;
        }
        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        if (problem.answer === submission) {
            const maxTime = PROBLEM_TIME_S * 1000; // 20 seconds in milliseconds
            const maxPoints = 100; // Maximum points for answering instantly
            const timeTaken = new Date().getTime() - problem.startTime;
            // Ensure timeTaken does not exceed maxTime
            const effectiveTime = Math.min(timeTaken, maxTime);
            // Calculate points inversely proportional to the time taken
            const points = Math.max(0, maxPoints - Math.floor((effectiveTime / maxTime) * maxPoints));
            user.points += points;
        }
    }
    genRandonString(length) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        var charLength = chars.length;
        var result = '';
        for (var i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }
}
exports.Quiz = Quiz;
