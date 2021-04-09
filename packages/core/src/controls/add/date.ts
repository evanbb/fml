declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    date: [Date | undefined];
  }
}

export default 'date';
