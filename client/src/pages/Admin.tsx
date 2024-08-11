import { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { CreateProblem } from "../components/CreateProblem";

export const Admin = () => {
    const [socket, setSocket] = useState<null | any>(null);
    const [quizId, setQuizId] = useState("");
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const socket = io("http://localhost:8000");
        socket.on("connect", () => {
            setSocket(socket)
            console.log("Admin connected", socket.id);
            socket.emit("joinAdmin", {
                password: "ADMIN_PASSWORD"
            })
        });
        
    }, []);

    if(!socket) {
        return <div className="flex justify-center items-center h-screen w-screen">
            <h1 className="text-4xl text-black font-bold">Please wait connection...</h1>
        </div>
    }

    if (!quizId) {
        return <div className="flex flex-col justify-center items-center h-screen w-screen">
            <h1 className="font-bold text-black text-2xl mb-4">Create a New Room</h1>   
        <input 
        type="text" 
        placeholder="Enter room name"
        className="w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={(e) => {
            setRoomId(e.target.value)
        }} />
        <br />
        <button 
        className="w-60 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={() => {
            socket.emit("createQuiz", {
                roomId
            });
            setQuizId(roomId);
        }}>Create a room</button>
    </div>
    }
    return <div> 
        <CreateProblem roomId={quizId} socket={socket} />
    </div>
}