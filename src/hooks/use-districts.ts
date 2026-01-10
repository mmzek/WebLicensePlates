import { useQuery } from "@tanstack/react-query";
import { type District, getDistricts } from "@/actions/districts";

export function useDistricts(voivodeship: string | null) {
  return useQuery<District[]>({
    queryKey: ["districts", voivodeship],
    queryFn: () => getDistricts(voivodeship!),
    enabled: !!voivodeship,
  });
}
