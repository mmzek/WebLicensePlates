"use client";
import { useQuery } from "@tanstack/react-query";
import { getQuizQuestions, type QuizQuestions } from "@/actions/quiz-questions";

export function useQuizQuestions() {
  return useQuery<QuizQuestions[]>({
    queryKey: ["quiz"],
    queryFn: getQuizQuestions,
    staleTime: 1000 * 60 * 10, // keep data fresh for 10 minutes
    gcTime: 1000 * 60 * 30,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
