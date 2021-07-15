import { KnownKeys } from '@fml/util-types';
import { FmlControlClassifications } from '@fml/controls';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FmlLayoutRegistration<TValue, TExtraConfig = undefined> = [
  FmlControlClassifications,
  TExtraConfig?,
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FmlLayoutRegistry<TValue>
  extends Record<string, FmlLayoutRegistration<TValue>> {}

export type FmlRegisteredLayouts = KnownKeys<FmlLayoutRegistry<never>>;
