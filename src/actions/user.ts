const url = process.env.NEXT_PUBLIC_API_URL;

export async function createOrUpdateUser(name: string) {
  const res = await fetch(`${url}users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (res.status === 409) {
    return "exists";
  }

  if (!res.ok) {
    throw new Error("Nie udało się zapisać usera");
  }

  return res.json();
}

export async function saveResult(payload: {
  userId: number;
  score: number;
  quizStart: string;
  quizEnd: string;
}) {
  const res = await fetch(`${url}users/scores`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorDetails;
    try {
      errorDetails = await res.json();
    } catch {
      errorDetails = await res.text();
    }

    throw new Error(
      `Nie udało się zapisać wyniku: ${res.status} - ${JSON.stringify(errorDetails)}`,
    );
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

  return null;
}

export async function fetchHallOfFame() {
  const res = await fetch(`${url}users/scores`);

  if (!res.ok) {
    throw new Error("Nie udało się pobrać rankingu");
  }

  return res.json();
}
