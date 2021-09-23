const TEXTAREA = 'fml:textarea';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TEXTAREA]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

export default TEXTAREA;
