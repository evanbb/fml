import { StringUnionOnlyNotString } from '../../utils';

declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    select: [
      StringUnionOnlyNotString<TValue>,
      [TValue] extends [string]
        ? string extends TValue
          ? never
          : FmlOptionsListConfiguration<TValue>
        : // todo: add support for multiple selects...
          never,
    ];
  }
}

export default 'select';
