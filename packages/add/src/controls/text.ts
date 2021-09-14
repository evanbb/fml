declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    text: [StringOnlyNotStringUnion<TValue> | undefined];
  }
}

export default 'text';
