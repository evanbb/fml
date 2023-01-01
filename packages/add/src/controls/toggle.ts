declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    toggle: [boolean | undefined];
  }
}

export default 'toggle';
