import type { SetupUserGet201ResponseData } from "@/api/as-seen-api";
import { createContext, useContext } from "react";

export interface IUserContext extends Partial<SetupUserGet201ResponseData> {
  userLocalDB?:PouchDB.Database;
} 

export const UserContext = createContext<IUserContext>({});

export function useUserContext() {
  const userContext = useContext(UserContext);
  return userContext;
}
