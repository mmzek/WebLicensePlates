"use client";
import { useQuery } from "@tanstack/react-query";
import { getVoivodeships, type Voivodeship } from "../actions/voivodeships";

export function useVoivodeships() {
  return useQuery<Voivodeship[]>({
    queryKey: ["voivodeships"],
    queryFn: getVoivodeships,
  });
}
