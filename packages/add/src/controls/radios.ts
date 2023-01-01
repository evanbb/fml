declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    radios: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : FmlOptionsListConfiguration<Value>
        : never,
    ];
  }
}

export default 'radios';
