import { useQuery } from "@tanstack/react-query";
import { getLicensePlatesByCode } from "../actions/license-plate";
import type { LicensePlate } from "../actions/license-plate";

export function useLicensePlates(code: string | null) {
  return useQuery<LicensePlate[]>({
    queryKey: ["license-plates", code],
    queryFn: () => getLicensePlatesByCode(code!),
    enabled: !!code,
  });
}
