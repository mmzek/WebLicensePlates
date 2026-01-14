import { useQuery } from "@tanstack/react-query";
import { getLicensePlateDetails } from "../actions/license-plate-details";
import type { LicensePlate } from "../actions/license-plate-details";

export function useLicensePlateDetails(code: string | null) {
  return useQuery<LicensePlate>({
    queryKey: ["license-plates", code],
    queryFn: () => getLicensePlateDetails(code!),
    enabled: !!code,
  });
}
