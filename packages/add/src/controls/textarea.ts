declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    textarea: [StringOnlyNotStringUnion<Value> | undefined];
  }
}

export default 'textarea';
