import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSessionQuery } from "@/components/user/useSessionQuery";
import { useRef } from "react";

const MagicLink = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get("redirect");
  const offlineSessionQuery = useSessionQuery();

  if (offlineSessionQuery.isPending) {
    console.log("MagicLink", "isPending");

    return <Progress className="animate-progress" />;
  }

  if (offlineSessionQuery.isError) {
    console.log("MagicLink", "Error");

    return <>Error.</>;
  }

  if (redirect) {
    console.log("MagicLink", "redirect", redirect);
        const redirectUrl = new URL(redirect);

    redirectUrl.searchParams.append("jwt", offlineSessionQuery.data?.jwt || "");
    console.log("MagicLink", "redirectSearchParams", redirectUrl.searchParams.toString());
    console.log("Redirecting to:", redirectUrl.href);

    return (
      <>
        <Button asChild>
          <a href={redirectUrl?.href}>Continue to App</a>
        </Button>
      </>
    );
  } else {
    console.log("MagicLink", "root");

    window.location.href = "/";
  }

  return <></>;
};

export const LinkHandle = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get("type");

  switch (type) {
    case "magic-link": {
      return <MagicLink />;
    }
    default: {
      return <></>;
    }
  }
};
