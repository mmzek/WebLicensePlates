export interface FunFact {
  description: string;
  imageUrl: string;
  source: string;
}

export interface LicensePlate {
  code: string;
  district: string;
  voivodeship: string;
  type: string;
  funFacts: FunFact[];
  numberOfViews: number;
}

export interface LicensePlateApi {
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

export async function getLicensePlatesByCode(
  code: string,
): Promise<LicensePlate[]> {
  if (!code) return [];

  const url = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(
    `${url}license-plates/contains/${encodeURIComponent(code)}`,
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
