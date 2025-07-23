import { authClient } from "@/utils/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useJWTLoginMutation } from "../auth/useJWTLoginMutation";

export function useSessionQuery() {
    const jwtLoginMutation = useJWTLoginMutation();
  
  const sessionQuery = useQuery({
    queryKey: ["useSessionQuery"],
    queryFn: async () => {
      let jwt: string | null = null;
      const { data, error } = await authClient.getSession({
        fetchOptions: {
          onSuccess: (ctx) => {
            jwt = ctx.response.headers.get("set-auth-jwt");
          },
        },
      });
      if (error) {
        throw new Error("AuthError");
      }
      if (!data || !jwt) {
        return null;
      }

      const rootUser = await jwtLoginMutation.mutateAsync(jwt);

      return rootUser;
    },

  });

  return sessionQuery;
}
