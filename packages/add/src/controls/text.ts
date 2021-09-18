declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    text: [StringOnlyNotStringUnion<Value> | undefined];
  }
}

export default 'text';
