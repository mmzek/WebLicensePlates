import { useQuery } from "@tanstack/react-query";
import { fetchHallOfFame } from "../actions/user";

export function useHallOfFame() {
  return useQuery({
    queryKey: ["hallOfFame"],
    queryFn: fetchHallOfFame,
    staleTime: 60_000,
  });
}
