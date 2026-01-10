"use client";

import { useQuizQuestions } from "@/hooks/use-quiz-questions";
import PolandMap from "./map";
import { useState, useEffect, useRef } from "react";
import { useDistricts } from "@/hooks/use-districts";
import QuizRanking from "./quiz-ranking";

export default function QuizRound() {
  const { data: q, isLoading } = useQuizQuestions();
  const [current, setCurrent] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [attempts, setAttempts] = useState(3);
  const [locked, setLocked] = useState(false);
  const [stage, setStage] = useState<"voivodeship" | "district">("voivodeship");
  const [districtAttempts, setDistrictAttempts] = useState(3);
  const MAX_TIME_PER_QUESTION = 60;
  const [totalScore, setTotalScore] = useState(0);
  const questionStartRef = useRef(0);
  const quizStartRef = useRef(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const nowRef = useRef(0);

  const question = q?.[current];
  const { data: districts, isLoading: isLoadingDistricts } = useDistricts(
    stage === "district" ? question?.voivodeship || null : null,
  );

  useEffect(() => {
    const start = Date.now();
    quizStartRef.current = start;
    questionStartRef.current = start;
    nowRef.current = start;
    const interval = setInterval(() => {
      nowRef.current = Date.now();
      setElapsedSeconds(
        Math.floor((nowRef.current - quizStartRef.current) / 1000),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (selectedVoivodeship: string) => {
    const timeTaken = Math.floor(
      (nowRef.current - questionStartRef.current) / 1000,
    );
    if (locked) return;

    const question = q?.[current];
    if (!question) return;

    const isCorrect =
      selectedVoivodeship.toLowerCase() === question.voivodeship.toLowerCase();
    console.log(`wybrana: ${selectedVoivodeship}`);
    console.log(`poprawna: ${question.voivodeship}`);

    if (isCorrect) {
      const speedBonus = Math.max(MAX_TIME_PER_QUESTION - timeTaken, 0);
      const pointsForThisQuestion = attempts * speedBonus;
      console.log(`${attempts} * ${speedBonus} = ${pointsForThisQuestion}`);

      setTotalScore((prev) => prev + pointsForThisQuestion);
      setAnswerStatus("correct");
      setLocked(true);
    } else {
      setAnswerStatus("wrong");
      setAttempts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setLocked(true);
          return 0;
        }
        return next;
      });
    }
  };

  const handleDistrictAnswer = (selectedDistrict: string) => {
    if (locked) return;

    const question = q?.[current];
    if (!question) return;

    const isCorrect =
      selectedDistrict.toLocaleLowerCase() === question.code.toLowerCase();
    console.log(`wybrana: ${selectedDistrict}`);
    console.log(`poprawna: ${question.code}`);

    if (isCorrect) {
      const timeTakenDistrict = Math.floor(
        (nowRef.current - questionStartRef.current) / 1000,
      );
      const speedBonusDistrict = Math.max(
        MAX_TIME_PER_QUESTION - timeTakenDistrict,
        0,
      );
      const districtScore = 2 * districtAttempts * speedBonusDistrict;
      console.log(
        `[SCORING] powiat: 2 * ${districtAttempts} * ${speedBonusDistrict} = ${districtScore}`,
      );
      setTotalScore((prev) => prev + districtScore);
      setAnswerStatus("correct");
      setLocked(true);

      setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setAnswerStatus(null);
        setAttempts(3);
        setDistrictAttempts(3);
        setLocked(false);
        setStage("voivodeship");
        questionStartRef.current = Date.now();
      }, 1200);
    } else {
      setAnswerStatus("wrong");
      setDistrictAttempts((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setLocked(true);
          setTimeout(() => {
            setCurrent((prev) => prev + 1);
            setAnswerStatus(null);
            setAttempts(3);
            setDistrictAttempts(3);
            setLocked(false);
            setStage("voivodeship");
            questionStartRef.current = Date.now();
          }, 1200);
          return 0;
        }
        return next;
      });
    }
  };

  useEffect(() => {
    if (answerStatus === "correct" && stage === "voivodeship") {
      const t = setTimeout(() => {
        setAnswerStatus(null);
        setLocked(false);
        setStage("district");
        questionStartRef.current = Date.now();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [answerStatus, stage]);

  useEffect(() => {
    if (attempts === 0 && stage === "voivodeship") {
      const t = setTimeout(() => {
        setCurrent((prev) => prev + 1);
        setAnswerStatus(null);
        setAttempts(3);
        setLocked(false);
        questionStartRef.current = Date.now();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [attempts, stage]);

  if (isLoading || !q) {
    return (
      <div className="text-white text-center mt-20">Ładowanie pytań...</div>
    );
  }

  if (!question) {
    return <QuizRanking points={totalScore} />;
  }

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center">
      <div className="fixed top-5 left-5 flex items-center z-50">
        <span className="text-2xl mr-2">⏱️</span>
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-500">
            Czas
          </span>
          <span className="text-xl font-black text-gray-400 leading-none">
            {minutes}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>
      <div className="fixed top-5 right-5 flex items-center bg-white px-4 py-2 rounded-full border-2 border-blue-400 shadow-lg z-50">
        <span className="text-2xl mr-2">🏆</span>
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold text-gray-500">
            Punkty
          </span>
          <span className="text-xl font-black text-gray-800 leading-none">
            {totalScore}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto text-center">
        <h2 className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs">
          Quiz o rejestracjach
        </h2>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-mono font-black text-white tracking-tighter">
            KOD REJESTRACYJNY:
          </span>
          <span className="text-5xl font-mono font-black text-blue-500 tracking-tighter shadow-blue-500/20 drop-shadow-sm">
            {question?.district}
          </span>
        </div>
        {stage === "voivodeship" && (
          <>
            <h2 className="text-2xl font-mono font-black text-white tracking-tighter mb-4">
              Z jakiego województwa pochodzi ten kod?
            </h2>
            <div className="w-3/5 bg-gray-900/40 rounded-2xl border border-white/5 overflow-hidden">
              <PolandMap onSelect={handleAnswer} locked={locked} />
            </div>
          </>
        )}
        {stage === "district" && (
          <>
            <h2 className="text-2xl font-mono font-black text-white tracking-tighter mb-4">
              Kod pochodzi z województwa {question.voivodeship}, z jakiego
              powiatu?
            </h2>
            <div className="w-full max-w-3xl bg-gray-900/40 rounded-2xl border border-white/5 p-6">
              {isLoadingDistricts ? (
                <div className="text-white text-center">
                  Ładowanie powiatów...
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {districts?.map((district) => (
                    <button
                      key={district.name}
                      onClick={() => handleDistrictAnswer(district.name)}
                      disabled={locked}
                      className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                    >
                      {district.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        {!answerStatus && <div className="mt-2 h-8"></div>}
        {answerStatus && (
          <div className="mt-2 text-xl font-bold">
            {answerStatus === "correct" ? (
              <span className="text-green-400">Poprawna odpowiedź!</span>
            ) : (
              <>
                {(stage === "voivodeship" && attempts > 0) ||
                (stage === "district" && districtAttempts > 0) ? (
                  <span className="text-red-400">
                    {" "}
                    Zła odpowiedź — pozostało prób:{" "}
                    {stage === "voivodeship" ? attempts : districtAttempts}{" "}
                  </span>
                ) : null}
                {districtAttempts == 0 && (
                  <span className="text-red-400">
                    Poprawna odpowiedź to {question.code}.
                  </span>
                )}
                {attempts == 0 && (
                  <span className="text-red-400">
                    Poprawna odpowiedź to {question.voivodeship}.
                  </span>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
