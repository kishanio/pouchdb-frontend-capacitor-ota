import UserLayout from "@/layouts/UserLayout";
import UserIndexScreen from "@/screens/UserIndexScreen";
import { Outlet, Route, Routes } from "react-router";
import ModuleRoute from "./ModuleRoute";
import SyncScreen from "@/screens/SyncScreen";

function UserRoute() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route path="" element={<UserIndexScreen />} />
        <Route path="sync" element={<SyncScreen />} />
        <Route
          path="module"
          element={
            <>
              <Outlet />
            </>
          }
        >
          {ModuleRoute()}
        </Route>
      </Route>
    </Routes>
  );
}

export default UserRoute;
