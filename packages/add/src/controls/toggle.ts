declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    toggle: [boolean | undefined];
  }
}

export default 'toggle';
