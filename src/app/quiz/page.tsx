"use client";

import { useState } from "react";
import QuizStart from "./quiz-start";
import QuizRound from "./quiz-round";

export default function QuizPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [nick, setNick] = useState("");

  const handleStart = (playerNick: string) => {
    setNick(playerNick);
    setQuizStarted(true);
  };

  return (
    <>
      {!quizStarted && <QuizStart onStart={handleStart} />}
      {quizStarted && <QuizRound nick={nick} />}
    </>
  );
}
