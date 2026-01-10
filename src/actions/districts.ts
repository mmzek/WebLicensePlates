export interface District {
  districtId: number;
  name: string;
  voivodeship: {
    name: string;
  };
}

export async function getDistricts(voivodeship: string): Promise<District[]> {
  if (!voivodeship) return [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${url}districts?voivodeship=${voivodeship}`);

  if (!response.ok) {
    throw new Error("Nie znaleziono powiatów");
  }

  return response.json();
}
