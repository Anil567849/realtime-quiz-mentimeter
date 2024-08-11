
function UserNotAuth({setSubmitted, setName, setCode, name, code}: {setSubmitted: any, setName: any, setCode: any, name: any, code: any}) {

    function handleJoin(){
        if(name == "" || code == "") return;
        setSubmitted(true);
    }

  return (
    <div>
        <div className="bg-blue-100 flex items-center justify-center h-screen">
            <div className="text-center">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold mb-2 text-slate-600">
                    English Quiz Application
                </h1>
                <p className="text-gray-600">Enter the code to join.</p>
            </div>
            <div className="mb-8">
                <input
                    className="text-start w-64 p-2 border border-blue-600 rounded-xl shadow-sm focus:outline-none focus:border-blue-800"
                    placeholder="Ex: 854521"
                    style={{ fontSize: "1rem" }}
                    type="text"
                    onChange={(e) => { setCode(e.target.value) }}
                />
                <br /> <br />
                <input
                    className="text-start w-64 p-2 border border-blue-600 rounded-xl shadow-sm focus:outline-none focus:border-blue-800"
                    placeholder="Your name"
                    style={{ fontSize: "1rem" }}
                    type="text"
                    onChange={(e) => { setName(e.target.value) }}
                />
            </div>
            <button
                className="bg-blue-600 text-white w-64 py-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:ring-opacity-50"
                style={{ fontSize: "1rem" }}
                onClick={handleJoin}
            >
                Join
            </button>
            </div>
        </div>

    </div>
  )
}

export {UserNotAuth}