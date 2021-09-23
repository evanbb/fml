const RADIOS = 'fml:radios'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [RADIOS]: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : OptionsListConfiguration<Value>
        : never,
    ];
  }
}

export default RADIOS;
