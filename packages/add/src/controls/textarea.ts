declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    textarea: [StringOnlyNotStringUnion<Value> | undefined];
  }
}

export default 'textarea';
