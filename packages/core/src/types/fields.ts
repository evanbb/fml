import { FmlFormControlConfigBase } from './common';

export interface FmlControlDataType<TValue> {
  checkbox: boolean;
  date: Date;
  datetime: Date;
  hidden: string;
  number: number;
  select: TValue extends [string]
    ? string extends TValue[0]
      ? never
      : TValue[0]
    : TValue extends string
    ? string extends TValue
      ? never
      : TValue
    : never;
  text: string;
  textarea: string;
  toggle: boolean;
}

export type FmlControlsFor<TValue> = keyof {
  [Key in keyof FmlControlDataType<TValue> as FmlControlDataType<TValue>[Key] extends never
    ? never
    : FmlControlDataType<TValue>[Key] extends TValue
    ? Key
    : never]: true;
};

export interface FmlSelectConfiguration<TValue extends [string]>
  extends FmlFormControlConfigBase<FmlControlDataType<TValue>['select']> {
  options: Record<TValue[0], string>;
}

interface FmlFieldAdditionalConfiguration<TValue> {
  select: [TValue] extends [string]
    ? string extends TValue
      ? never
      : FmlSelectConfiguration<[TValue]>
    : never;
}

interface FmlFieldConfigurationBase<TValue>
  extends FmlFormControlConfigBase<TValue> {
  control: FmlControlsFor<TValue>;
  // we want to require this property be explicitly set at the field level, but it
  // can remain set to undefined if it makes sense for that type of field
  defaultValue: TValue | undefined;
}

export type FmlFieldConfigurationForControl<
  TValue,
  TControl
> = TControl extends keyof FmlFieldAdditionalConfiguration<TValue>
  ? FmlFieldConfigurationBase<TValue> &
      FmlFieldAdditionalConfiguration<TValue>[TControl]
  : FmlFieldConfigurationBase<TValue>;

export type FmlFieldConfiguration<
  TValue
> = FmlFieldConfigurationBase<TValue> extends infer U
  ? U extends FmlFieldConfigurationBase<TValue>
    ? U['control'] extends infer TControl
      ? FmlFieldConfigurationForControl<TValue, TControl>
      : never
    : never
  : never;
