import { useState } from "react"

const ini = [{
    id: 0,
    title: ""
},{
    id: 1,
    title: ""
},{
    id: 2,
    title: ""
},{
    id: 3,
    title: ""
}]

export const CreateProblem = ({socket, roomId}: {socket: any; roomId: string;}) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [answer, setAnswer] = useState(0);
    const [options, setOptions] = useState(ini)


    function handleOptions(e: any, optionId: any){
            setOptions((prevOptions: any) => {
                return prevOptions.map((op: any) => {
                    if (op.id === optionId) {
                        return {
                            ...op,
                            title: e.target.value
                        }
                    }
                    return op;
                })
            })
    }

    const handleClick = () => {
        socket.emit("createProblem", {
            roomId,
            problem: {
                title,
                description,
                options,
                answer,
            }
        });
        setTitle('');
        setDescription('');
        setAnswer(0);
        setOptions(ini);
    }

    return <div className="flex flex-col justify-center items-center h-screen">
        <div>
            <h1 className="text-4xl text-black font-bold mb-5">Create a problem</h1>
        </div>
        <div className="flex flex-col justify-center items-center">
            <input 
            className="my-2 w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} placeholder="Title"/>
            <input 
            className="my-2 w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            type="text" value={description} onChange={(e) => { setDescription(e.target.value) }} placeholder="Description"/>
            
            {[0, 1, 2, 3].map((optionId) => {
                return <div key={optionId} className="flex  my-2"> 
                <div className="flex items-center mr-5">
                    <h4 style={{display: "inline"}} className="text-sm text-black mr-2">Option {optionId}: </h4> 
                    <input 
                    className=""
                    value={optionId} type="radio" checked={optionId === answer} onChange={() => {setAnswer(optionId)}}/>
                </div>
                <input 
                className="w-60 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter Option"
                value={options[optionId].title} type="text" onChange={(e) => handleOptions(e, optionId)}/>
                
            </div>
            })}
            
            <button 
            className="w-60 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={handleClick}>Add problem</button>       
            <button 
            className="mt-3 w-60 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            onClick={() => {
                    socket.emit("next", {
                        roomId
                    })
                }}>Quiz Live</button>       
        </div>
    </div>
}