declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    hidden: [StringOnlyNotStringUnion<Value> | undefined];
  }
}

export default 'hidden';
