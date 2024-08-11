import { IoManager } from "./managers/IoManager";

export type AllowedSubmissions = 0 | 1 | 2 | 3;
const PROBLEM_TIME_S = 20;

interface User {
    id: string;
    name: string;
    points: number;
}

interface Submission {
    problemId: string;
    userId: string;
    isCorrect: boolean;
    optionSelected: AllowedSubmissions
}

interface Problem {
    id: string;
    title: string;
    description: string;
    image?: string;
    startTime: number;
    answer: AllowedSubmissions; // 0, 1, 2, 3
    options: {
        id: number;
        title: string;
    }[]
    submissions: Submission[]
}

export class Quiz {
    public roomId: string;
    private problems: Problem[];
    private activeProblem: number;
    private currentProblem: Problem | null;
    private users: User[];
    private currentState: "leaderboard" | "question" | "not_started" | "ended";
    
    constructor(roomId: string) {
        this.roomId = roomId;
        this.problems = []
        this.activeProblem = 0;
        this.users = [];
        this.currentProblem = null;
        this.currentState = "not_started";
    }

    addUser(name: string) {
        const id = this.genRandonString(7);
        this.users.push({
            id,
            name,
            points: 0
        })
        return id;
    }

    addProblem(problem: Problem) {
        this.problems.push(problem);
        // console.log('problem pushed', problem)
    }
    
    setActiveProblem(problem: Problem) {
        this.currentState = "question"
        problem.startTime = new Date().getTime();
        problem.submissions = [];
        this.currentProblem = problem;
        IoManager.getIo().to(this.roomId).emit("problem", {
            problem
        })
        setTimeout(() => {
            this.sendLeaderboard();
        }, PROBLEM_TIME_S * 1000);
    }   
    
    sendLeaderboard() {
        this.currentState = "leaderboard"
        const leaderboard = this.getLeaderboard();
        IoManager.getIo().to(this.roomId).emit("leaderboard", {
            leaderboard
        })
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
        } else {
            const leaderboard = this.getLeaderboard();
            IoManager.getIo().to(this.roomId).emit("quiz_end", {
                leaderboard
            })
        }
    }

    getCurrentState() {
        if (this.currentState === "not_started") {
            return {
                type: "not_started",
                leaderboard: null,
                problem: null,
            }
        }
        if (this.currentState === "ended") {
            return {
                type: "ended",
                leaderboard: this.getLeaderboard(),
                problem: null,
            }
        }
        if (this.currentState === "leaderboard") {
            return {
                type: "leaderboard",
                leaderboard: this.getLeaderboard(),
                problem: null,
            }
        }
        if (this.currentState === "question") {
            return {
                type: "question",
                problem: this.currentProblem,
                leaderboard: null,
            }
        }
    }

    submit(userId: string, roomId: string, problemId: string, submission: AllowedSubmissions) {
        const problem = this.problems.find(x => x.id == problemId);
        const user = this.users.find(x => x.id === userId);
 
        if (!problem || !user) {
            console.log("problem or user not found")
            return;
        }
        const existingSubmission = problem.submissions.find(x => x.userId === userId);
 
        if (existingSubmission) {
            console.log("submissions exist")
            return;
        }
 
        problem.submissions.push({
            problemId,
            userId,
            isCorrect: problem.answer === submission,
            optionSelected: submission
        });
        if(problem.answer === submission){
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

    private genRandonString(length: number) {
        var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()';
        var charLength = chars.length;
        var result = '';
        for ( var i = 0; i < length; i++ ) {
           result += chars.charAt(Math.floor(Math.random() * charLength));
        }
        return result;
    }
}