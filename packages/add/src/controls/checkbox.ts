declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    checkbox: [boolean | undefined];
  }
}

export default 'checkbox';
