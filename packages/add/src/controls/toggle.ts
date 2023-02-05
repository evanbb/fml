declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    toggle: [boolean];
  }
}

export default 'toggle';