import { Outlet } from "react-router";
import { ModuleContext } from "./useModuleContext";
import { useAllDocs } from "use-pouchdb";
import { ModuleSchemaCompiler, type IModuleSchema } from "./moduleSchema";

function ModuleLayoutRender(props: { module: IModuleSchema }) {
  const { rows } = useAllDocs({
    startkey: `${props.module.id}:`,
    endkey: `${props.module.id}:\uffff`,
    include_docs: true,
  });

  const isModuleValid = ModuleSchemaCompiler.Check(props.module);

  if (!isModuleValid) {
    console.error("Invalid module schema:", props.module);
    return <div>Error: Invalid module schema</div>;
  }

  // create a module table in the database
  return (
    <ModuleContext.Provider
      value={{
        moduleDocs: rows.map((row) => row.doc),
        module: props.module,
      }}
    >
      <div className="module-layout">
        <Outlet />
      </div>
    </ModuleContext.Provider>
  );
}

export default ModuleLayoutRender;
