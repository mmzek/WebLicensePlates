export default function QuizRanking({ points }: { points: number }) {
  const playerName = "Gracz";

  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-[#0f172a]  z-100">
      <div className="bg-white p-6 rounded-3xl w-1/3 shadow-2xl border-2 border-blue-400 flex flex-col items-center mx-4">
        <h1 className="text-3xl font-black text-gray-800 mb-4 uppercase tracking-tighter">
          Koniec Quizu!
        </h1>
        <div className="text-7xl animate-bounce">🏆</div>
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-600 uppercase tracking-wide">
            {playerName} zdobywa
          </h2>
          <div className="mt-2 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black text-yellow-500">
              {points}
            </span>
            <span className="text-gray-400 font-medium uppercase text-sm">
              punktów
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
