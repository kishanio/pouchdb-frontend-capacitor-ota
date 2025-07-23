import { z } from "zod";

console.log(import.meta.env)
export const configSchema = z.object({
  VITE_WEBAPP_URL: z.string().url(),
  VITE_AUTH_URL: z.string().url(),
  VITE_ANDROIDAPP_DEEPLINK: z.string().url(),

  VITE_APP_VERSION: z.string().min(1),
  VITE_APP_NAME: z.string().min(1),
  VITE_BUILD_TIME: z.string().min(1),
  VITE_GIT_COMMIT: z.string().min(1),
  VITE_IS_DEVELOPMENT: z.boolean(),
  VITE_IS_PRODUCTION: z.boolean(),
});

export type Config = z.infer<typeof configSchema>;


export const config = {
  ...configSchema.parse(import.meta.env),
};
