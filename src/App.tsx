import { AppContext } from "./hooks/useAppContext";
import { Route, Routes } from "react-router";
import UserRoute from "./routes/UserRoute";
import AuthRoute from "./routes/auth-route";
import { useSessionQuery } from "./components/user/useSessionQuery";
import { LinkHandle } from "./screens/LinkHandle";
import { useRootContext } from "./hooks/useRootContext";
import { AppUpdate } from "./components/AppUpdate";
import { useDeeplinkListener } from "./hooks/useDeeplinkListener";

function App() {
  useSessionQuery();
  useDeeplinkListener();
  const rootContext = useRootContext();

  return (
    <>
      <AppContext.Provider value={{}}>
        <Routes>
          <Route path="/link/auth/callback" element={<LinkHandle />} />
          <Route path="/update" element={<AppUpdate />} />

          <Route
            path="*"
            element={rootContext.user?.id ? <UserRoute /> : <AuthRoute />}
          />
        </Routes>
      </AppContext.Provider>
    </>
  );
}

export default App;
