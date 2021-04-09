import { StringOnlyNotStringUnion } from '../../utils';

declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    text: [StringOnlyNotStringUnion<TValue> | undefined];
  }
}

export default 'text';
