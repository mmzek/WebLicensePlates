export interface QuizQuestions {
    code: string,
    voivodeship: string,
    district: string,
}

export async function getQuizQuestions(): Promise<QuizQuestions[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${url}quiz`);

  if (!response.ok) {
    throw new Error("Nie można wygenerować quizu");
  }

  return response.json();
}
