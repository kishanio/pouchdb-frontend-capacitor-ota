import App from "./App";
import { BrowserRouter } from "react-router";
import { RootContext, type IRootContextUser } from "./hooks/useRootContext";
import useIsOnlineQuery from "./hooks/useIsOnlineQuery";
import { Badge } from "./components/ui/badge";
import useLocalStorageState from "use-local-storage-state";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { asSeenAPI } from "./api";
import { Capacitor } from "@capacitor/core";

const persister = createAsyncStoragePersister({
  storage: window.localStorage,
});

function Root() {
  const isOnline = useIsOnlineQuery();
  const [user, setUser] = useLocalStorageState<IRootContextUser | undefined>(
    "user",
    {
      defaultValue: undefined,
    }
  );

  console.log("Root", "isOnline", isOnline);
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof asSeenAPI.ResponseError) {
          if (error.response.status === 401) {
            setUser(undefined);
            console.error("Unauthorized access, user cleared.");
          }
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        onError: (error) => {
          console.error("Mutation error:", error);
        },
      },
    },
  });

  return (
    <>
      <RootContext.Provider
        value={{
          online: isOnline,
          user,
          setUser,
          isAndroid: Capacitor.getPlatform() === "android",
        }}
      >
        <BrowserRouter>
          <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister }}
          >
            <App />
          </PersistQueryClientProvider>
        </BrowserRouter>
      </RootContext.Provider>
      <div className="fixed bottom-2 right-1.5 p-2 z-10">
        {isOnline ? (
          <Badge variant={"secondary"}>Online</Badge>
        ) : (
          <Badge variant={"destructive"}>Offline</Badge>
        )}
      </div>
    </>
  );
}

export default Root;
