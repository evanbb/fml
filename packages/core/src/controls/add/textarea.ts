import { StringOnlyNotStringUnion } from '../../utils';

declare module '../' {
  export interface FmlFieldControlRegistry<TValue>
    extends Record<string, FmlFieldControlRegistration<unknown>> {
    textarea: [StringOnlyNotStringUnion<TValue> | undefined];
  }
}

export default 'textarea';
