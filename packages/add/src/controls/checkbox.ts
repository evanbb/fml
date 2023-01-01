declare module '@fml/core' {
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    checkbox: [boolean | undefined];
  }
}

export default 'checkbox'