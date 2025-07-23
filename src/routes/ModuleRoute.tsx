import { Route } from "react-router";

import ModuleLayoutRender from "@/components/module/ModuleLayoutRender";
import FeatureRender from "@/components/module/FeatureRender";
import type { IModuleSchema } from "@/components/module/moduleSchema";

export const modules: Array<IModuleSchema> = [
  {
    id: "todo",
    label: "Todo",
    fields: [
      {
        id: "title",
        label: "Title",
        type: "text",
        required: true,
        placeholder: "Enter todo title",
      },
      {
        id: "completed",
        label: "Completed",
        type: "checkbox",
        required: false,
        placeholder: "Is this todo completed?",
      },
    ],
    features: [
      {
        id: "list",
        label: "List Todos",
        render: {
          type: "list",
        },
      },
      {
        id: "create",
        label: "Create Todo",
        render: {
          type: "create",
        },
      },
    ],
  },
];

function ModuleRoute() {
  return (
    <>
      {modules.map((module) => {
        return (
          <Route
            key={`module-${module.id}`}
            path={module.id}
            element={<ModuleLayoutRender module={module} />}
          >
            {module.features.map((feature, featureIdx) => {
              let path = feature.id;
              if (featureIdx === 0) {
                path = "";
              }
              return (
                <Route
                  key={`feature-${feature.id}`}
                  path={path}
                  element={<FeatureRender feature={feature} />}
                />
              );
            })}
          </Route>
        );
      })}
    </>
  );
}

export default ModuleRoute;
