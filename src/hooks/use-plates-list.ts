import { useQuery } from "@tanstack/react-query";
import { getPlatesList } from "../actions/plates-list"
import type { LicensePlate } from "../actions/license-plate";

export function usePlatesList(voivodeship: string | null) {
  return useQuery<LicensePlate[]>({
    queryKey: ["license-plates", voivodeship],
    queryFn: () => getPlatesList(voivodeship!),
    enabled: !!voivodeship,
  });
}
