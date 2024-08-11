import { Socket } from "socket.io";
import { QuizManager } from "./QuizManager";

export class UserManager {
    private quizManager;

    constructor() {
        this.quizManager = new QuizManager();
    }

    addUser(socket: Socket){
        this.createHandlers(socket);
    }

    private createHandlers(socket: Socket) {
        socket.on('joinUser', ({roomId, name}) => {
            const userId = this.quizManager.addUser(roomId, name)
            if(!userId) {
                socket.emit("init", {
                    userId: null,
                    state: {
                        type: "not_started",
                        leaderboard: null,
                        problem: null,
                    }
                });
                return;
            }
            socket.emit("init", {
                userId,
                state: this.quizManager.getCurrentState(roomId)
            });

            // This method is used to join the socket (the connection) to a "room." A room is a logical grouping of sockets that allows you to send messages to specific subsets of connected clients.
            // using io.to(roomId).emit('event', data); will send the event to all clients that have joined roomId, including the one that just joined.
            socket.join(roomId);
        })

        socket.on("joinAdmin", (data) => {

            if(data.password != 'ADMIN_PASSWORD'){
                return;
            }

            socket.on("createQuiz", data => {
                this.quizManager.addQuiz(data.roomId);
            })

            socket.on("createProblem", data => {
                this.quizManager.addProblem(data.roomId, data.problem);
            });

            socket.on("next", data => {
                this.quizManager.next(data.roomId);
            });

        })

        socket.on("submit", (data) => {
            const userId = data.userId;
            const problemId = data.problemId;
            const submission = data.submission;
            const roomId = data.roomId;
            if (submission != 0 && submission != 1 && submission != 2 && submission != 3) {
                console.error("issue while getting input " + submission )
                return;
            }
            this.quizManager.submit(userId, roomId, problemId, submission)
        });

    }
}