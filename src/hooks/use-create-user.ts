import { useMutation } from "@tanstack/react-query";
import { createOrUpdateUser } from "../actions/user";

export function useCreateUser() {
  return useMutation({
    mutationFn: ({ name }: { name: string }) => createOrUpdateUser(name),
  });
}
