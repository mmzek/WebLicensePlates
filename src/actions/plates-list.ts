import type { LicensePlateApi, LicensePlate } from "./license-plate";

export async function getPlatesList(
  voivodeship: string,
): Promise<LicensePlate[]> {
  if (!voivodeship) return [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(
    `${url}license-plates?voivodeship=${voivodeship}`,
  );

  if (!response.ok) {
    throw new Error("Nie znaleziono rejestracji");
  }

  const data = await response.json();

  return data.map(
    (item: LicensePlateApi): LicensePlate => ({
      code: item.code,
      district: item.district.name,
      voivodeship: item.district.voivodeship.name,
      type: item.type.type,
      funFacts: item.funFacts.map((ff) => ({
        description: ff.description,
        imageUrl: ff.imageUrl,
        source: ff.source,
      })),
      numberOfViews: item.numberOfViews,
    }),
  );
}
