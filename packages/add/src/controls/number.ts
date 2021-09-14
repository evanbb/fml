declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    number: [number | undefined];
  }
}

export default 'number';
