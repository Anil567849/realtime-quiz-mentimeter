
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { LeaderBoard } from "../components/leaderboard/LeaderBoard"
import { Quiz } from "../components/Quiz";
import { NotStarted } from "./NotStarted";

export const UserAuth = ({name, code: roomId} : {name: any, code : any}) => {
    const [socket, setSocket] = useState<null | any>(null);
    const [currentState, setCurrentState] = useState("not_started");
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [userId, setUserId] = useState("");


    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("connect", () => {
            setSocket(socket)
            console.log("User Joined", socket.id);
            socket.emit("joinUser", {
                roomId,
                name
            })
        });
        
        socket.on("init", ({userId, state}) => {
            setUserId(userId);
            console.log("init", userId, state)

            if (state.leaderboard) {
                setLeaderboard(state.leaderboard)
            }

            if (state.problem) {
                setCurrentQuestion(state.problem);
            }

            setCurrentState(state.type);
        });

        socket.on("leaderboard", (data) => {
            setCurrentState("leaderboard");
            setLeaderboard(data.leaderboard);
        });

        socket.on("problem", (data) => {
            setCurrentState("question");
            setCurrentQuestion(data.problem);
        })

        socket.on("quiz_end", (data) => {
            setCurrentState("quiz_end");
            setLeaderboard(data.leaderboard);
        })
        
    }, []);

    if (currentState === "not_started") {
        return <NotStarted name={name}/>
    }
    if (currentState === "question") {
        return <Quiz roomId={roomId} userId={userId} problemId={currentQuestion.id} quizData={{
            title: currentQuestion.title,
            options: currentQuestion.options
        }} socket={socket} />
    }
    if (currentState === "leaderboard") {
        return <LeaderBoard leaderboardData={leaderboard} />
    }

    return <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="mt-10 text-3xl text-black font-bold">Quiz has ended</h1>
        <div>
        <LeaderBoard leaderboardData={leaderboard} />
        </div>
        <button 
        className="mt-5 bg-blue-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
        onClick={() => window.location.reload()}>Go Back</button>
    </div>
}