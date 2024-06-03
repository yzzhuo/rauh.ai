export default function SmileyFace({
    loading = false,
}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen relative p-36">
           <div className={`animate-${loading ? 'spin' : 'pulse'} absolute w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-2xl`}></div>
            {/* <div className="flex justify-center items-center space-x-2">
                <div className="bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-md w-16 h-36 animate-bounce"></div>
                <div className="bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-md w-16 h-36 animate-bounce200"></div>
                <div className="bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-md w-16 h-36 animate-bounce400"></div>
            </div> */}
            {/* <div className="w-40 h-40 relative opacity-80"> */}
                {/* <div className="absolute top-8 left-8 w-6 h-6 bg-white rounded-full animate-blink"></div> */}
                {/* <div className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full animate-blink"></div> */}
                {/* <div className="absolute bottom-6 left-10 right-10 h-5 bg-white rounded-full"></div> */}
            {/* </div> */}
        </div>
    );
}