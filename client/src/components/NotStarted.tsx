

import React from 'react'

function NotStarted({name}: {name: any}) {
  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center">
            <h2 className="text-black font-bold text-xl">Opps! {name}</h2>
            <h1 className="my-5 text-black font-bold text-2xl">This Quiz Hasn't Started Yet!</h1>
            <button 
            className="bg-blue-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
            onClick={() => window.location.reload()}>Go Back</button>
        </div>
  )
}

export {NotStarted}