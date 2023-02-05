declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    hidden: [StringOnlyNotStringUnion<Value>];
  }
}

export default 'hidden';
