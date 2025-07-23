import { createContext, useContext } from "react";
import type { IModuleSchema } from "./moduleSchema";

interface IModuleContext {
  moduleDocs: Array<any>;
  module: IModuleSchema;
}
export const ModuleContext = createContext<IModuleContext>({
  moduleDocs: [],
  module: {
    id: "default",
    label: "Default",
    features: [],
    fields: [],
  },
});

export function useModuleContext() {
  const moduleContext = useContext(ModuleContext);
  return moduleContext;
}
