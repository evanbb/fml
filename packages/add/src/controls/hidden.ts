declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    hidden: [StringOnlyNotStringUnion<TValue> | undefined];
  }
}

export default 'hidden';
