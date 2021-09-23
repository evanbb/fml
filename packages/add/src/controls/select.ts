const SELECT = 'fml:select';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [SELECT]: [
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

export default SELECT;
