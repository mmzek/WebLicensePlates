"use client";

import { useQuizQuestions } from "@/hooks/use-quiz-questions";
import PolandMap from "./map";
import { useState, useEffect } from "react";

export default function QuizRound() {
  const { data: q, isLoading } = useQuizQuestions();
  const [current, setCurrent] = useState(0);
  const [answerStatus, setAnswerStatus] = useState<"correct" | "wrong" | null>(null);
  const [attempts, setAttempts] = useState(3);
  const [locked, setLocked] = useState(false);

  const handleAnswer = (selectedVoivodeship: string) => {
  if (locked) return;

  const question = q?.[current];
  if (!question) return;

  const isCorrect = selectedVoivodeship === question.voivodeship;

  if (isCorrect) {
    setAnswerStatus("correct");
    setLocked(true);
  } else {
    setAnswerStatus("wrong");

    setAttempts(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setLocked(true);
        return 0;
      }

      return next;
    });
  }
};

  useEffect(() => {
    if (answerStatus === "correct") {
      const t = setTimeout(() => {
        setCurrent(prev => prev + 1);
        setAnswerStatus(null);
        setAttempts(3);
        setLocked(false);
      }, 1200);

      return () => clearTimeout(t);
    }
  }, [answerStatus]);
  useEffect(() => {
    if (attempts === 0) {
      const t = setTimeout(() => {
        setCurrent(prev => prev + 1);
        setAnswerStatus(null);
        setAttempts(3);
        setLocked(false);
      }, 1200);

      return () => clearTimeout(t);
    }
  }, [attempts]);

  if (isLoading || !q) {
    return (
      <div className="text-white text-center mt-20">
        Ładowanie pytań...
      </div>
    );
  }

  const question = q[current];

  if (!question) {
    return (
      <div className="text-white text-center mt-20">
        Koniec quizu!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center font-sans">
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
  <h2 className="text-2xl font-mono font-black text-white tracking-tighter mb-4">
    Z jakiego województwa pochodzi ten kod?
  </h2>
  <div className="w-3/5 bg-gray-900/40 rounded-2xl border border-white/5 overflow-hidden">
    <PolandMap onSelect={handleAnswer} locked={locked}/>
  </div>  
  {!answerStatus &&(<div className="mt-2 h-8"></div>)}

        {answerStatus && (
          <div className="mt-2 text-xl font-bold">
            {answerStatus === "correct" ? (
              <span className="text-green-400">Poprawna odpowiedź!</span>
            ) : (
              <span className="text-red-400">
                Zła odpowiedź — pozostało prób: {attempts}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}