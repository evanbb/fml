
import type { KnownKeys, IsPartial } from '../utils';
import type { FmlControlClassification, FmlControlClassifications } from '../controls';
import type { FmlConfiguration } from '../index';

export type FmlLayoutsFor<TValue> = keyof {
  [K in FmlRegisteredLayouts as FmlControlClassification<TValue> extends FmlLayoutRegistry<TValue>[K][0]
    ? K
    : never]: K;
};

export type FmlLayoutConfiguration<
  TValue,
  TLayoutKey extends FmlRegisteredLayouts = FmlLayoutsFor<TValue>,
> = FmlLayoutRegistry<TValue>[TLayoutKey][1] extends undefined
  ? [TLayoutKey, FmlConfiguration<TValue>]
  : IsPartial<FmlLayoutRegistry<TValue>[TLayoutKey][1]> extends true
  ?
      | [
          TLayoutKey,
          FmlLayoutRegistry<TValue>[TLayoutKey][1],
          FmlConfiguration<TValue>,
        ]
      | [TLayoutKey, FmlConfiguration<TValue>]
  : [
      TLayoutKey,
      FmlLayoutRegistry<TValue>[TLayoutKey][1],
      FmlConfiguration<TValue>,
    ];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type FmlLayoutRegistration<TValue, TExtraConfig = undefined> = [
  FmlControlClassifications,
  TExtraConfig?,
];

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FmlLayoutRegistry<TValue>
  extends Record<string, FmlLayoutRegistration<TValue>> {}

export type FmlRegisteredLayouts = KnownKeys<FmlLayoutRegistry<never>>;

const registry = new Map<FmlRegisteredLayouts, unknown>();

export function register(key: FmlRegisteredLayouts, impl: unknown): void {
  registry.set(key, impl);
}

export function getLayoutImplementation(key: FmlRegisteredLayouts): unknown {
  return registry.get(key);
}
