declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    toggle: [boolean | undefined];
  }
}

export default 'toggle';
