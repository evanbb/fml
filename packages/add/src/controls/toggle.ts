const TOGGLE = 'fml:toggle'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [TOGGLE]: [boolean | undefined, ControlConfigurationBase<boolean | undefined>];
  }
}

export default TOGGLE;
