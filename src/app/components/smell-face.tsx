export default function SmileyFace() {
    return (
        <div className="flex flex-col items-center justify-center h-screen relative">
            <div className="absolute w-80 h-80 bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-2xl"></div>
            <div className="w-40 h-40 relative opacity-80">
                <div className="absolute top-8 left-8 w-6 h-6 bg-white rounded-full animate-blink"></div>
                <div className="absolute top-8 right-8 w-6 h-6 bg-white rounded-full animate-blink"></div>
                <div className="absolute bottom-6 left-10 right-10 h-5 bg-white rounded-full"></div>
            </div>
        </div>
    );
}