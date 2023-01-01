declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    select: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : FmlOptionsListConfiguration<Value>
        : // todo: add support for multiple selects...
          never,
    ];
  }
}

export default 'select';
