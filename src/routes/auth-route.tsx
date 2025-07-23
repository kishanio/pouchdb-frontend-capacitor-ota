import { LoginForm } from "@/components/auth/LoginForm";
import AuthLayout from "@/layouts/auth-layout";
import { Route, Routes } from "react-router";

function AuthRoute() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route path="" element={<LoginForm />} />
      </Route>
    </Routes>
  );
}

export default AuthRoute;
