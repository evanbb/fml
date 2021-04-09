import { StringUnionOnlyNotString } from '../../utils';

declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    radios: [
      StringUnionOnlyNotString<TValue>,
      [TValue] extends [string]
        ? string extends TValue
          ? never
          : FmlOptionsListConfiguration<TValue>
        : never,
    ];
  }
}

export default 'radios';
