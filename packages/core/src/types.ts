//#region common

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

interface FmlFormControlConfigBase<TValue> {
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

//#endregion

//#region validation

export interface FmlValidator<TValue> {
  (value: TValue): boolean | Promise<boolean>;
}

export type FmlControlValidatorReturnTypes =
  | string
  | string[]
  | undefined
  | void
  | Promise<string | string[] | undefined | void>;

export interface FmlControlValidator<TValue> {
  (value: TValue): FmlControlValidatorReturnTypes;
}

export interface FmlValidatorFactory<
  TValue = unknown,
  TArgs extends ReadonlyArray<unknown> = []
> {
  (...params: TArgs): FmlValidator<TValue>;
}

export interface FmlKnownValidators {
  required: FmlValidatorFactory;
  minLength: FmlValidatorFactory<
    string | { length: number },
    [minLength: number]
  >;
  maxLength: FmlValidatorFactory<
    string | { length: number },
    [maxLength: number]
  >;
  between: FmlValidatorFactory<number, [range: { min: number; max: number }]>;
  greaterThan: FmlValidatorFactory<number, [minimum: number]>;
  lessThan: FmlValidatorFactory<number, [maximum: number]>;
  before: FmlValidatorFactory<Date, [before: Date]>;
  after: FmlValidatorFactory<Date, [after: Date]>;
  within: FmlValidatorFactory<Date, [dateRange: { after: Date; before: Date }]>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [more: string]: FmlValidatorFactory<any, any>;
}

type FmlValidValidatorKeysFor<TValue> = keyof {
  [Key in keyof FmlKnownValidators as FmlKnownValidators[Key] extends FmlValidatorFactory<
    infer TValidatorValue,
    never
  >
    ? TValidatorValue extends TValue
      ? Key
      : never
    : never]: Key;
};

export type FmlValidatorConfiguration<TValue> = {
  message: string;
  validator: FmlValidValidatorKeysFor<TValue>;
} extends {
  message: string;
  validator: infer Validator;
}
  ? Validator extends keyof FmlKnownValidators
    ? [] extends Parameters<FmlKnownValidators[Validator]>
      ? {
          message: string;
          validator: Validator;
        }
      : {
          message: string;
          validator: Validator;
          args: Parameters<FmlKnownValidators[Validator]>;
        }
    : never
  : never;

//#endregion

//#region fields

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
  defaultValue: undefined extends TValue ? TValue | undefined : TValue;
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

//#endregion

//#region models

export interface FmlModelConfiguration<TValue>
  extends FmlFormControlConfigBase<TValue> {
  schema: { [Key in keyof TValue]: FmlFormConfiguration<TValue[Key]> };
}

//#endregion

//#region lists

export interface FmlListConfiguration<TValue>
  extends FmlFormControlConfigBase<TValue[]> {
  itemSchema: FmlFormConfiguration<TValue>;
}

//#endregion
