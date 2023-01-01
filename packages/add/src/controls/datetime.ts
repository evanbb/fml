declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    datetime: [Date | undefined];
  }
}

export default 'datetime';
