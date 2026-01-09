"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuizQuestions, type QuizQuestions } from "@/actions/quiz-questions";

export function useQuizQuestions() {
  return useQuery<QuizQuestions[]>({
    queryKey: ["quiz"],
    queryFn: getQuizQuestions,
  });
}
