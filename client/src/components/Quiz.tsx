import { useState } from 'react';

/**
 Simple View with title and answers - $25
    title : string
    choices: strings[]
    image?: string
 */

export function Quiz({quizData, socket, userId, problemId, roomId}: {
    quizData: {
        title: string;
        options: {
          id: number, 
          title: string,
        }[];
    },
    socket: any;
    roomId: string;
    userId: string;
    problemId: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submission , setSubmission] = useState(0);

  const handleClick = () => {
    setSubmitted(true);
    socket.emit("submit", {
        userId,
        problemId,
        submission: Number(submission),
        roomId,
    })
  }

  return (
    <div className="h-screen">
      <div className="flex w-full justify-center items-center h-screen">
        <div className="">
            <SingleQuiz
                choices={quizData.options.map(x => x.title)}
                title={quizData.title}
                imageURL={""}
                setSelected={setSubmission}
                sub={submission}
            />
          <div className="flex justify-between w-full mt-4 text-white">
            <button            
              className="w-60 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={submitted}
              onClick={handleClick}
            >
              Submit
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

type SingleQuizProps = {
  title: string;
  choices: string[];
  imageURL?: string;
  setSelected: any;
  sub: any;
};


function SingleQuiz({ title, choices, imageURL, setSelected, sub}: SingleQuizProps) {
  return (
    <div className='flex flex-col justify-center items-center'>
      <h2 className="my-5 text-2xl text-black font-bold">Question: {title}</h2>
      {imageURL && <img src={imageURL} alt="" />}
      {choices.length && choices.map((choice, index) => {
          return (
            <div
              key={index}
              className="flex items-center border border-2 w-full py-2 pl-2 m-2 ml-0 space-x-2 cursor-pointer rounded-xl bg-black/5"
              onClick={() => {
                setSelected(index)
              }}>
              <input
                type="radio"
                name="option"
                value={choice}
                checked={index == sub}
                className="w-6 h-6 bg-black"
              />
              <p className="pl-5 text-black font-bold text-md">{choice}</p>
            </div>
          );
        })}
    </div>
  );
}