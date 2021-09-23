const HIDDEN = 'fml:hidden';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [HIDDEN]: [
      StringOnlyNotStringUnion<Value> | undefined,
      ControlConfigurationBase<StringOnlyNotStringUnion<Value> | undefined>,
    ];
  }
}

export default HIDDEN;
