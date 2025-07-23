import { Type, type Static } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'
import { Value } from '@sinclair/typebox/value'

const FeatureSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  render: Type.Object({
    type: Type.String(),
  })
});

export type IFeatureSchema = Static<typeof FeatureSchema>;
export const FeatureSchemaCompiler = TypeCompiler.Compile(FeatureSchema);

const FieldSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  type: Type.String(),
  required: Type.Optional(Type.Boolean()),
  placeholder: Type.Optional(Type.String()),
});

export type IFieldSchema = Static<typeof FieldSchema>;
export const FieldSchemaCompiler = TypeCompiler.Compile(FieldSchema);

export const ModuleSchema = Type.Object({
  id: Type.String(),
  label: Type.String(),
  fields: Type.Array(FieldSchema),
  features: Type.Array(
    FeatureSchema
  )
});

export type IModuleSchema = Static<typeof ModuleSchema>;
export const ModuleSchemaCompiler = TypeCompiler.Compile(ModuleSchema);

export function parseModule(moduleJSON: unknown) {
   const result = ModuleSchemaCompiler.Check(moduleJSON);
   if (!result) {
     throw new Error('Invalid module schema');
   }
   return Value.Parse(ModuleSchema, moduleJSON)
}