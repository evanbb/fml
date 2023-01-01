declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    text: [StringOnlyNotStringUnion<Value> | undefined];
  }
}

export default 'text';
