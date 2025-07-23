import { useAsSeenAPI } from "@/api/useAsSeenAPI";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserSidebar from "@/components/user/user-sidebar";
import { useQuery } from "@tanstack/react-query";
import { Outlet } from "react-router";
import PouchDB from "pouchdb";
import { useRootContext } from "@/hooks/useRootContext";
import { UserContext } from "@/components/user/useUserContext";
import FullScreenSpinner from "@/components/custom-ui/FullScreenSpinner";
import { useEffect } from "react";
import { Provider } from "use-pouchdb";
import { Button } from "@/components/ui/button";
import { syncManager } from "@/lib/sync-manager";

function UserLayout() {
  const rootContext = useRootContext();
  const asSeeenAPI = useAsSeenAPI();
  console.log("UserLayout", "rootContext", rootContext);
  const userDBQuery = useQuery({
    queryKey: ["userSetup", rootContext.user?.id],

    queryFn: async () => {
      const setupUserResponse = await asSeeenAPI?.setupUserGet();

      return {
        url: setupUserResponse?.data.url,
        dbName: setupUserResponse?.data.dbName,
      };
    },
  });


  let userLocalDB: PouchDB.Database | undefined;

  if (userDBQuery.data?.dbName) {
    userLocalDB = new PouchDB(userDBQuery?.data?.dbName);
  }

  useEffect(() => {
    if (!userLocalDB || !userDBQuery.data?.url || !rootContext.online) {
      return;
    }

    if (!syncManager.isRunning()) {
      syncManager.startSync(userLocalDB, userDBQuery.data.url, userDBQuery.data.dbName);
    }
  }, [userDBQuery.data, rootContext.online, userLocalDB]);


  if (userDBQuery.isLoading) {
    return <FullScreenSpinner />;
  }


  if (!userLocalDB) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center">
        <p className="text-red-500">Error loading local db fatal</p>
        <Button
          onClick={() => {
            userDBQuery.refetch();
          }}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <Provider pouchdb={userLocalDB}>
        <UserContext.Provider
          value={{
            ...userDBQuery.data,
            userLocalDB,
          }}
        >
          <SidebarProvider
            
          >
            <UserSidebar />
            <SidebarInset>
              <Outlet />
            </SidebarInset>
          </SidebarProvider>
        </UserContext.Provider>
      </Provider>
    </>
  );
}

export default UserLayout;
