declare module '@fml/core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface FmlFieldControlRegistry<Value>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    checkbox: [boolean];
  }
}

export default 'checkbox'