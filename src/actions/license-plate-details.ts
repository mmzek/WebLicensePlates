export interface LicensePlate {
  registrationPlateId: number;
  code: string;
  district: {
    districtId: number;
    name: string;
    voivodeship: {
      voivodeshipId: number;
      name: string;
    };
  };
  type: {
    registrationTypeId: number;
    type: string;
  };
  funFacts: {
    description: string;
    imageUrl: string;
    source: string;
  }[];
  numberOfViews: number;
}

export async function getLicensePlateDetails(
  code: string,
): Promise<LicensePlate> {
  if (!code) throw new Error("Code is required");

  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(
    `${url}license-plates/${encodeURIComponent(code)}`,
  );

  if (!response.ok) {
    throw new Error("Nie znaleziono rejestracji");
  }

  return response.json();
}
