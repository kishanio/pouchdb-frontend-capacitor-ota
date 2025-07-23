import { createContext, useContext } from "react";
export interface IAppContext {
 
}

export const AppContext = createContext<IAppContext>({

});


export function useAppContext() {
  const appContext = useContext(AppContext);
  return appContext;
}