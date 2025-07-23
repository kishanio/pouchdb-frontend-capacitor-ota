import { authClient } from "@/utils/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useLogoutMutation() {
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      queryClient.setQueryData(["authSession"], null);
       queryClient.clear();

      await authClient.signOut();
      return true;
    },
  });

  return logoutMutation;
}
