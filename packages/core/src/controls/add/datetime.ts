declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    datetime: [Date | undefined];
  }
}

export default 'datetime';
