import { getAsSeenAPI } from "@/api/useAsSeenAPI";
import { useEffect, useRef, useState } from "react";

export function useIsOnlineQuery() {
  const [isOnline, setIsOnline] = useState(false);
  const lastKnownStatus = useRef(false); // holds previous status to avoid unnecessary updates

  useEffect(() => {

    const checkOnline = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);

        const healthRef = await getAsSeenAPI().healthGet();
        clearTimeout(timeout);
        const newStatus = healthRef.message === "ok";

        // Only update state if status changed
        if (lastKnownStatus.current !== newStatus) {
          lastKnownStatus.current = newStatus;
          setIsOnline(newStatus);
        }
      } catch (error) {
        console.error("useIsOnlineQuery", "Error checking online status:", error);
        if (lastKnownStatus.current !== false) {
          lastKnownStatus.current = false;
          setIsOnline(false);
        }
      }
    };

    checkOnline(); // Initial check

    const intervalId = setInterval(() => {
      checkOnline();
    }, 10000); // Check every 10 seconds in background

    const handleOnline = () => checkOnline();
    const handleOffline = () => {
      lastKnownStatus.current = false;
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

export default useIsOnlineQuery;