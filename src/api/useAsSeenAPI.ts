import { asSeenAPI } from ".";
import { useRootContext } from "@/hooks/useRootContext";

export const getAsSeenAPI = (jwt?: string) => {
  const config = new asSeenAPI.Configuration({
    apiKey: `Bearer ${jwt}`,
  });

  return new asSeenAPI.DefaultApi(config);
};

export function useAsSeenAPI() {
  const rootContext = useRootContext();

  console.log("useAsSeenAPI", rootContext?.user?.jwt);

  return getAsSeenAPI(rootContext?.user?.jwt);
}
