import { FmlControlDataType, FmlFieldConfiguration } from './fields';
import { FmlListConfiguration } from './lists';
import { FmlModelConfiguration } from './models';
import { FmlValidatorConfiguration } from './validators';

export interface Noop {
  (): void;
}

export type FmlValidationStatus = 'pending' | 'valid' | 'invalid' | 'unknown';

export interface FmlValueState<TValue> {
  value: TValue;
  validity: FmlValidationStatus;
}

export interface FmlValueStateChangeHandler<TValue> {
  (change: FmlValueState<TValue>): void;
}

export interface FmlFormControlConfigBase<TValue> {
  label: string;
  defaultValue?: TValue;
  validators?: FmlValidatorConfiguration<TValue>[];
}

type FmlDataTypesForControls = {
  [Key in keyof FmlControlDataType<never>]: FmlControlDataType<never>[Key];
}[keyof FmlControlDataType<never>];

export type FmlFormConfiguration<TValue> = [TValue] extends [
  FmlDataTypesForControls | undefined,
]
  ? FmlFieldConfiguration<TValue>
  : TValue extends ReadonlyArray<infer TCollection> | undefined
  ? FmlListConfiguration<TCollection>
  : TValue extends unknown | undefined
  ? FmlModelConfiguration<TValue>
  : never;
