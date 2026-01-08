export interface Voivodeship {
  voivodeshipId: number,
  name: string,
}

export async function getVoivodeships(): Promise<Voivodeship[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${url}voivodeships`);

  if (!response.ok) {
    throw new Error("Nie można wyświetlić województw");
  }

  return response.json();
}

