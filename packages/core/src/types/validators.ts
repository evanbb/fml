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

export interface FmlValidatorRegistry {
  required: FmlValidatorFactory;
  minLength: FmlValidatorFactory<
    string | { length: number },
    [minLength: number]
  >;
  maxLength: FmlValidatorFactory<
    string | { length: number },
    [maxLength: number]
  >;
  between: FmlValidatorFactory<
    number,
    [range: { min: number; max: number }, inclusive?: boolean]
  >;
  greaterThan: FmlValidatorFactory<
    number,
    [minimum: number, inclusive?: boolean]
  >;
  lessThan: FmlValidatorFactory<number, [maximum: number, inclusive?: boolean]>;
  before: FmlValidatorFactory<Date, [before: Date, inclusive?: boolean]>;
  after: FmlValidatorFactory<Date, [after: Date, inclusive?: boolean]>;
  within: FmlValidatorFactory<
    Date,
    [dateRange: { after: Date; before: Date }, inclusive?: boolean]
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [more: string]: FmlValidatorFactory<any, any>;
}

export type FmlKnownValidators = {
  [K in keyof FmlValidatorRegistry as string extends K
    ? never
    : number extends K
    ? never
    : K]: FmlValidatorRegistry[K];
};

export type FmlKnownValidatorKeys = keyof FmlKnownValidators;

export type FmlValidValidatorsFor<TValue> = {
  [Key in keyof FmlKnownValidators as FmlKnownValidators[Key] extends FmlValidatorFactory<
    infer TValidatorValue,
    never
  >
    ? TValidatorValue extends TValue
      ? Key
      : TValue extends TValidatorValue
      ? Key
      : never
    : never]: FmlKnownValidators[Key];
};

export type FmlValidValidatorKeysFor<
  TValue
> = keyof FmlValidValidatorsFor<TValue>;

export type FmlValidatorConfiguration<TValue> = {
  message: string;
  validator: FmlValidValidatorKeysFor<TValue>;
} extends {
  message: string;
  validator: infer Validator;
}
  ? Validator extends FmlKnownValidatorKeys
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
