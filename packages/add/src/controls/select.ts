declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    select: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : OptionsListConfiguration<Value>
        : // todo: add support for multiple selects...
          never,
    ];
  }
}

export default 'select';
