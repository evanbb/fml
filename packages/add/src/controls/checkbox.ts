const CHECKBOX = 'fml:checkbox'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [CHECKBOX]: [boolean | undefined, ControlConfigurationBase<boolean | undefined>];
  }
}

export default CHECKBOX