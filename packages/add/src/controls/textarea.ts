declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    textarea: [StringOnlyNotStringUnion<TValue> | undefined];
  }
}

export default 'textarea';
