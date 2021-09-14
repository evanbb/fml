declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    toggle: [boolean | undefined];
  }
}

export default 'toggle';
