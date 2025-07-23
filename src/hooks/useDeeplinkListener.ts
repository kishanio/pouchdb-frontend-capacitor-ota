import { useEffect, useRef } from "react";
import type { URLOpenListenerEvent } from "@capacitor/app";
import { App as CapApp } from "@capacitor/app";
import { useJWTLoginMutation } from "@/components/auth/useJWTLoginMutation";

export function useDeeplinkListener() {
  const jwtLoginMutation = useJWTLoginMutation();

  // Store the latest `mutate` function in a ref
  const mutateRef = useRef(jwtLoginMutation.mutate);

  useEffect(() => {
    mutateRef.current = jwtLoginMutation.mutate;
  }, [jwtLoginMutation.mutate]);

  useEffect(() => {
    let removeListener: (() => void) | undefined;

    const setupListener = async () => {
      const listener = await CapApp.addListener(
        "appUrlOpen",
        (event: URLOpenListenerEvent) => {
          if (!event.url) return;

          const url = new URL(event.url);
          const type = url.searchParams.get("type");
          const jwt = url.searchParams.get("jwt");

          if (type === "magic-link" && jwt) {
            mutateRef.current(jwt);
          }
        }
      );

      // Save remove function for cleanup
      removeListener = listener.remove;
    };

    setupListener();

    return () => {
      if (removeListener) {
        removeListener(); // no need to await this
      }
    };
  }, []);
}
