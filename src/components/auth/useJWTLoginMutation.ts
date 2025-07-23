import { getAsSeenAPI } from "@/api/useAsSeenAPI";
import { useMutation } from "@tanstack/react-query";
import { useRootContext, type IRootContextUser } from "../../hooks/useRootContext";

export const useJWTLoginMutation = () => {
  const rootContext = useRootContext();
  const jwtLoginMutation = useMutation({
    mutationFn: async (jwt: string) => {
      console.log("useJWTLoginMutation", "jwt", jwt);
      const asSeenAPI = getAsSeenAPI(jwt);
      const authMeResponse = await asSeenAPI.authMeGet();
      if (!authMeResponse) {
        throw new Error("Failed to fetch user data");
      }

      const rootUser: IRootContextUser = {
        jwt,
        ...authMeResponse,
      }
      rootContext.setUser(rootUser);
      return rootUser;
    },
  });

  return jwtLoginMutation;
};
