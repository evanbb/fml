declare module '@fml/core' {
  export interface FieldControlRegistry<Value>
    extends Record<string, FieldControlRegistration<unknown>> {
    checkbox: [boolean | undefined];
  }
}

export default 'checkbox'