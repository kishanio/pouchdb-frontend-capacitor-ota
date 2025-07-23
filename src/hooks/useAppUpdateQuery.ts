import { getAsSeenAPI } from "@/api/useAsSeenAPI";
import { config } from "@/utils/config";
import { useQuery } from "@tanstack/react-query";
import { useRootContext } from "../hooks/useRootContext";

export const useAppUpdateQuery = () => {
  const rootContext = useRootContext();
  const appUpdateQuery = useQuery({
    queryKey: ["appUpdate"],
    queryFn: async () => {
      let updatedRequired = false;
      const appInfoResponse = await getAsSeenAPI().appInfoGet();
      if (
        appInfoResponse.data.appVersion !== config.VITE_APP_VERSION &&
        rootContext.isAndroid
      ) {
        updatedRequired = true;
      }
      return {
        ...appInfoResponse.data,
        updatedRequired,
      };
    },
  });

  return appUpdateQuery;
};
