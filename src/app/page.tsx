'use client'
export default function Home() {

  const handleClickStart = () => {
    // navigate to the chat page
    window.location.href = '/chat';
  };

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center justify-center p-24">
      <div className="relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <h2 className="text-4xl font-semibold">
          Practice Mindfulness with AI Guide
        </h2>
      </div>
      <button onClick={handleClickStart} className="px-5 py-3 mt-16 rounded-md border border-black bg-white text-black text-base hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
        Start Meditation
      </button>
    </main>
  );
}
