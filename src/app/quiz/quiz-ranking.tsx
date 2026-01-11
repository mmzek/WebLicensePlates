import { useHallOfFame } from "../../hooks/use-hall-of-fame";
import { saveResult } from "../../actions/user";
import { getUserId } from "../../actions/user-storage";
import { useEffect, useRef } from "react";

interface LeaderboardEntry {
  position: number;
  userName: string;
  totalScore: number;
}

export default function QuizRanking({
  points,
  playerName,
  quizStartTime,
}: {
  points: number;
  playerName: string;
  quizStartTime: number;
}) {
  const { data, isLoading, isError } = useHallOfFame();
  const hasSaved = useRef(false);

  useEffect(() => {
    if (hasSaved.current) return;

    const saveScore = async () => {
      const userId = getUserId();

      if (!userId) {
        return;
      }

      if (points === 0) {
        return;
      }

      hasSaved.current = true;

      try {
        const quizEnd = Date.now();
        const payload = {
          userId,
          score: points,
          quizStart: new Date(quizStartTime).toISOString(),
          quizEnd: new Date(quizEnd).toISOString(),
        };

        await saveResult(payload);
      } catch (error) {
        console.error("Błąd zapisu wyniku:", error);
        hasSaved.current = false;
      }
    };

    saveScore();
  }, [points, quizStartTime]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
      <div className="bg-[#1f1f1f] p-2 rounded-3xl w-1/3 shadow-2xl border-2 border-blue-400 flex flex-col items-center">
        <h2 className="text-blue-500 font-bold uppercase tracking-large text-xl mb-8">
          Koniec quizu!
        </h2>
        <div className="text-center mb-8 bg-[#1f1f1f] w-1/2 p-4 rounded-2xl shadow-2xl border-2 border-blue-400">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Twój Wynik
          </h2>
          <div className="mt-1 flex items-baseline justify-center gap-2">
            <span className="text-5xl text-white font-bold">{points}</span>
            <span className="text-gray-400 font-medium uppercase text-xs">
              pkt
            </span>
          </div>
          <p className="text-blue-400 font-semibold mt-1">{playerName}</p>
        </div>
        <div className="w-full pb-10 command-scroll">
          <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4 border-b pb-2">
            Najlepsze wyniki
          </h3>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {isLoading && (
              <p className="text-center text-gray-500">Ładowanie rankingu...</p>
            )}

            {isError && (
              <p className="text-center text-red-400 text-sm">
                Nie udało się pobrać wyników.
              </p>
            )}

            {!isLoading &&
              !isError &&
              data?.map((d: LeaderboardEntry, index: number) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    d.userName === playerName && d.totalScore === points
                      ? "bg-blue-400/20 border"
                      : "bg-[#1f1f1f]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 text-sm font-bold text-white`}>
                      {index + 1}.
                    </span>
                    <span className="font-bold text-white">{d.userName}</span>
                  </div>
                  <span className="font-black text-blue-600">
                    {d.totalScore}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-400 px-4 py-2 rounded-xl text-black font-bold filter"
        >
          ZAGRAJ PONOWNIE
        </button>
      </div>
    </div>
  );
}
