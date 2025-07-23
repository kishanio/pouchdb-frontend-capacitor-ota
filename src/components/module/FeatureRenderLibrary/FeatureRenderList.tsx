import { Separator } from "@/components/ui/separator";
import type { IFeatureSchema } from "../moduleSchema";
import { useModuleContext } from "../useModuleContext";
import { Fragment } from "react";

function FeatureRenderList(props: { feature: IFeatureSchema }) {
  const moduleContext = useModuleContext();
  return (
    <>
      <section className="py-32">
        <div className="container px-0 md:px-8">
          <h1 className="mb-10 px-4 text-3xl font-semibold md:mb-14 md:text-4xl">
            {props.feature.label}
          </h1>
          <div className="flex flex-col">
            <Separator />

            {moduleContext.moduleDocs.map((item, index) => (
              <Fragment key={`FeatureRenderList-${item.id}-${index}`}>
                <div className="grid items-center gap-4 px-4 py-5 md:grid-cols-4">
                  <div className="order-2 flex items-center gap-2 md:order-none">
                    
                    <div className="flex flex-col gap-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        <pre>
                            {JSON.stringify(item, null, 2)}
                        </pre>
                      </p>
                    </div>
                  </div>
                  <p className="order-1 text-2xl font-semibold md:order-none md:col-span-2">
                    {item.description}
                  </p>
                </div>
                <Separator />
              </Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default FeatureRenderList;
