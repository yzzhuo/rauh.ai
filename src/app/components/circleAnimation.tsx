export default function CircleAnimation({
    loading = false,
}) {
    return (
        <div className="flex flex-col items-center justify-center h-screen relative p-24">
           <div className={`animate-${loading ? 'spin' : 'pulse'} absolute w-64 h-64 md:w-80 md:h-80 bg-gradient-to-r from-sky-300 to-indigo-300 rounded-full blur-lg`}></div>
        </div>
    );
}