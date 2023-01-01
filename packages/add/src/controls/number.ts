declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    number: [number | undefined];
  }
}

export default 'number';
