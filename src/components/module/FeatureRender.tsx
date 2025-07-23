import FeatureRenderList from "./FeatureRenderLibrary/FeatureRenderList";
import type { IFeatureSchema } from "./moduleSchema";
import { useModuleContext } from "./useModuleContext";

function FeatureRender(props: { feature: IFeatureSchema }) {
  const moduleContext = useModuleContext();

  const isFeatureValid = moduleContext.module.features.some(
    (feature) => feature.id === props.feature.id
  );

  if (!isFeatureValid) {
    console.error("Invalid feature schema:", props.feature);
    return <div>Error: Invalid feature schema</div>;
  }

  const key= `${moduleContext.module.id}-${props.feature.id}`;

  switch (props.feature.render.type) {
    case "list":
      return (
        <div key={key} id={key}>
          <FeatureRenderList feature={props.feature} />
        </div>
      );
    default:
      console.warn(`No render type defined for feature: ${props.feature.id}`);
      return (
        <div key={key} id={key}>
          <h3>Feature: {props.feature.label}</h3>
          <p>This is a placeholder for the feature: {props.feature.id}.</p>
        </div>
      );
  }
}

export default FeatureRender;
