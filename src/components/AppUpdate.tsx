import { CapacitorUpdater } from "@capgo/capacitor-updater";
import { useMutation } from "@tanstack/react-query";
import FullScreenSpinner from "./custom-ui/FullScreenSpinner";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useAppUpdateQuery } from "@/hooks/useAppUpdateQuery";

export const AppUpdate = () => {
  const appUpdateQuery = useAppUpdateQuery();

  const appUpdateMutation = useMutation({
    mutationFn: async () => {
      if (!appUpdateQuery.data?.updatedRequired) {
        throw new Error("No update required");
      }
      const download = await CapacitorUpdater.download({
        version: "0.0.4",
        url: appUpdateQuery.data?.appBundleURL,
      });

      window.location.reload();
      await CapacitorUpdater.set(download);
    },
  });

  if (appUpdateQuery.isPending) {
    return <FullScreenSpinner />;
  }

  if (appUpdateMutation.isPending) {
    return <FullScreenSpinner />;
  }
  return (
    <>
      <Button
        onClick={() => {
          appUpdateMutation.mutate();
        }}
      >
        Download
      </Button>
      <Button asChild>
        <Link to="/">
        Home
        </Link>
      </Button>
    </>
  );
};
