const TEXT = 'fml:text';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TEXT]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

export default TEXT;
