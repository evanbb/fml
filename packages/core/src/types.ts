//#region common

interface FormElementConfigBase<TValue> {
  label: string;
  defaultValue?: TValue;
  validators?: ValidatorConfiguration<TValue>[];
}

type DataTypes = {
  [Key in keyof ControlDataType<any>]: ControlDataType<any>[Key];
}[keyof ControlDataType<any>];

export type FormConfig<TValue> = [TValue] extends [DataTypes]
  ? FieldConfiguration<TValue>
  : TValue extends ReadonlyArray<infer TCollection>
  ? ListConfiguration<TCollection>
  : TValue extends {}
  ? ModelConfiguration<TValue>
  : never;

//#endregion

//#region validation

export interface Validator<TValue> {
  (value: TValue): boolean | Promise<boolean>;
}

export interface ValidatorFactory<
  TValue = any,
  TArgs extends ReadonlyArray<any> = []
> {
  (...params: TArgs): Validator<TValue>;
}

export interface KnownValidators {
  required: ValidatorFactory;
  minLength: ValidatorFactory<{ length: number }, [minLength: number]>;
  maxLength: ValidatorFactory<{ length: number }, [maxLength: number]>;
  between: ValidatorFactory<number, [range: { min: number; max: number }]>;
  greaterThan: ValidatorFactory<number, [minimum: number]>;
  lessThan: ValidatorFactory<number, [maximum: number]>;
  before: ValidatorFactory<Date, [before: Date]>;
  after: ValidatorFactory<Date, [after: Date]>;
  within: ValidatorFactory<Date, [dateRange: { after: Date; before: Date }]>;
}

type ValidValidatorKeysFor<TValue> = keyof {
  [Key in keyof KnownValidators as KnownValidators[Key] extends ValidatorFactory<
    infer TValidatorValue,
    infer _
  >
    ? TValidatorValue extends TValue
      ? Key
      : never
    : never]: Key;
};

export type ValidatorConfiguration<TValue> = {
  message: string;
  validator: ValidValidatorKeysFor<TValue>;
} extends {
  message: string;
  validator: infer Validator;
}
  ? Validator extends keyof KnownValidators
    ? [] extends Parameters<KnownValidators[Validator]>
      ? {
          message: string;
          validator: Validator;
        }
      : {
          message: string;
          validator: Validator;
          args: Parameters<KnownValidators[Validator]>;
        }
    : never
  : never;

export type ValidationStatus = 'pending' | 'valid' | 'invalid';

//#endregion

//#region fields

export interface ControlDataType<TValue> {
  checkbox: boolean;
  date: Date;
  datetime: Date;
  hidden: string;
  number: number;
  select: TValue extends string
    ? string extends TValue
      ? never
      : TValue
    : never;
  text: string;
  textarea: string;
  toggle: boolean;
}

export type ControlsFor<TValue> = keyof {
  [Key in keyof ControlDataType<TValue> as ControlDataType<TValue>[Key] extends never
    ? never
    : ControlDataType<TValue>[Key] extends TValue
    ? Key
    : never]: true;
};

export interface SelectConfiguration<TValue extends string>
  extends FormElementConfigBase<ControlDataType<TValue>['select']> {
  options: Record<TValue, string>;
}

interface FieldAdditionalConfiguration<TValue> {
  select: TValue extends string
    ? string extends TValue
      ? never
      : SelectConfiguration<TValue>
    : never;
}

interface FieldConfigurationBase<TValue> extends FormElementConfigBase<TValue> {
  control: ControlsFor<TValue>;
}

export type FieldConfigurationForControl<
  TValue,
  TControl
> = TControl extends keyof FieldAdditionalConfiguration<TValue>
  ? FieldConfigurationBase<TValue> &
      FieldAdditionalConfiguration<TValue>[TControl]
  : FieldConfigurationBase<TValue>;

export type FieldConfiguration<
  TValue
> = FieldConfigurationBase<TValue> extends infer U
  ? U extends FieldConfigurationBase<TValue>
    ? U['control'] extends infer TControl
      ? FieldConfigurationForControl<TValue, TControl>
      : never
    : never
  : never;

//#endregion

//#region models

export interface ModelConfiguration<TValue>
  extends FormElementConfigBase<TValue> {
  schema: { [Key in keyof TValue]: FormConfig<TValue[Key]> };
}

//#endregion

//#region lists

export interface ListConfiguration<TValue>
  extends FormElementConfigBase<TValue> {
  itemSchema: FormConfig<TValue>;
}

//#endregion
