import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://192.168.0.179:4001/auth",
  plugins: [magicLinkClient()],
});
