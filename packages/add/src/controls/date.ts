declare module '@fml/core' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    date: [Date | undefined];
  }
}

export default 'date';
