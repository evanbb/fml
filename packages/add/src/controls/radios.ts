declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    radios: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : OptionsListConfiguration<Value>
        : never,
    ];
  }
}

export default 'radios';
