declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    datetime: [Date | undefined];
  }
}

export default 'datetime';
