//#region utils

export type StringUnionOnlyNotString<Value> =
  /**
   * If a) it's a tuple of [TSomethingThatExtendsString]
   * and b) the tuple is of exactly [string]
   * then we don't want it.
   * Otherwise, it must be a tuple of ['something' | 'interesting'], in which
   * case we want the single element of the tuple (the union)
   */

  Value extends [string]
  ? string extends Value[0]
  ? never
  : Value[0]
  : /**
     * Otherwise, if a) it's a TSomethingThatExtendsString
     * and b) it's exactly string
     * then we don't want it.
     * Otherwise, it must be 'something' | 'insteresting', in which case
     * we want the union
     */
  Value extends string
  ? string extends Value
  ? never
  : Value
  : never;

export type StringOnlyNotStringUnion<Value> =
  /**
   * If a) it's a TSomethingThatExtendsString
   * and b) it's exactly string
   * then it's what we want.
   * Otherwise, it must be 'something' | 'insteresting', in which case
   * we aren't interested
   */
  Value extends string ? (string extends Value ? string : never) : string;

export type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: K;
};

export type IsPartial<T> = Partial<T> extends T ? true : false;

export type ListItem<Value> = Value extends ReadonlyArray<infer Item> ? Item : never

//#endregion

//#region controls

//#region common stuff

/**
 * The various validity statuses in which data bound to a form control can be.
 */
export type FmlValidityStatus = 'valid' | 'pending' | 'invalid' | 'unknown';

/**
 * The state a form control maintains about a piece of data.
 */
export interface FmlValueState<Value> {
  value: Value;
  validity: FmlValidityStatus;
}

/**
 * Called when the value or validity of a piece of data has changed, e.g.,
 * through a user interaction or when an async validator resolves.
 */
export interface FmlValueStateChangeHandler<Value> {
  (change: FmlValueState<Value>): void;
}

/**
 * Basic info that every form control needs in order to configure itself to
 * render and run.
 */
export interface FmlControlConfigurationBase<Value> {
  label: string;
  defaultValue?: Value;
  validators?: FmlValidatorConfiguration<Value>[];
}

/**
 * The different classifications of controls.
 */
export type FmlControlClassifications = 'field' | 'model' | 'list';

/**
 * Basic descriptor of a validator and a message to display if validation fails.
 */
export interface FmlValidatorConfigurationBase<
  Validator extends KnownKeys<FmlValidatorFactoryRegistry>,
> {
  message: string;
  validator: Validator;
}

/**
 * Returns the configuration required to describe a validator to apply to a
 * control.
 */
export type FmlValidatorConfiguration<Value> = [
  FmlValidatorKeys<Value>,
] extends [infer Validator]
  ? Validator extends keyof FmlValidatorFactoryRegistry
  ? [
    Validator,
    ...Parameters<FmlValidatorFactoryRegistry[Validator]>,
    string,
  ]
  : never
  : never;

//#endregion

//#region controls

/**
 * This registry contains the defined classifications of controls that may be
 * bound to various pieces of data on a form (fields, models, and lists). It is
 * used to map to implementations of each classification, e.g., different types
 * of fields (checkboxes, text inputs, date pickers, etc.)
 */
interface FmlControlClassificationConfigurationRegistry<Value>
  extends Record<
    FmlControlClassifications,
    Value extends ReadonlyArray<infer Item>
    ? FmlControlConfigurationBase<Item[]>
    : FmlControlConfigurationBase<Value>
  > {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: Value extends ReadonlyArray<infer _>
  ? never
  : FmlFieldConfiguration<Value>;
  list: Value extends ReadonlyArray<infer Item>
  ? FmlListConfiguration<Item>
  : never;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  model: Value extends ReadonlyArray<infer _>
  ? never
  : FmlModelConfiguration<Value>;
}

/**
 * Returns the classification of control that can be bound to the provided
 * data type. I.e., if it is
 * 1. A field value type, it should be bound to a 'field' control
 * 2. An array of something, it should be bound to a 'list' control
 * 3. Anything else, it should be bound to a 'model' control
 */
export type FmlControlClassification<Value> = [Value] extends [
  FmlFieldValueTypes | undefined,
]
  ? 'field'
  : Value extends ReadonlyArray<unknown> | undefined
  ? 'list'
  : Value extends unknown | undefined
  ? 'model'
  : never;

/**
 * Returns the appropriate configuration type for the provided data type.
 */
export type FmlControlConfiguration<Value> =
  FmlControlClassificationConfigurationRegistry<Value>[FmlControlClassification<Value>];

//#endregion controls

//#region fields

export type FmlFieldValueTypes = string | number | boolean | Date;

/**
 * Basic descriptor of the field to bind a value to.
 */
export interface FmlFieldConfigurationBase<
  Value,
  Control extends FmlRegisteredFieldControls = FmlRegisteredFieldControls,
> extends FmlControlConfigurationBase<Value> {
  control: Control;
  defaultValue: Value
}

/**
 * Returns a union of appropriate configurations for the provided data type.
 */
export type FmlFieldConfiguration<Value> = FmlFieldConfigurationBase<
  Value,
  FmlRegisteredFieldControls
> extends infer TConfig
  ? TConfig extends FmlFieldConfigurationBase<
    Value,
    FmlRegisteredFieldControls
  >
  ? TConfig['control'] extends infer Control
  ? Control extends FmlFieldControlsFor<Value>
  ? Control extends keyof FmlFieldControlRegistry<Value>
  ? Control extends KnownKeys<FmlFieldControlRegistry<Value>>
  ? FmlFieldControlRegistry<Value>[Control][1] extends undefined
  ? FmlFieldConfigurationBase<Value, Control>
  : FmlFieldConfigurationBase<Value, Control> &
  FmlFieldControlRegistry<Value>[Control][1]
  : never
  : never
  : never
  : never
  : never
  : never;

export type FmlFieldControlRegistration<ExtraConfig> = [
  FmlFieldValueTypes,
  ExtraConfig?,
];

export interface FmlOptionsListConfiguration<Value extends string> {
  options: Record<Value, string>;
}

/**
 * This registry contains the defined types of controls that are available to
 * bind to fields on a form.
 *
 * This interface can be extended to effectively register new (or clobber
 * existing) field controls.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FmlFieldControlRegistry<Value> {
  [more: string]: FmlFieldControlRegistration<unknown>;
}

/**
 * This returns a union of the names of registered field controls.
 */
export type FmlRegisteredFieldControls = KnownKeys<
  FmlFieldControlRegistry<never>
>;

/**
 * This returns a union of the names of registered field controls that are
 * designed for the provided data type.
 */
export type FmlFieldControlsFor<Value> = keyof {
  [K in KnownKeys<
    FmlFieldControlRegistry<Value>
  > as Value extends FmlFieldControlRegistry<Value>[K][0] ? K : never]: K;
};

const controlRegistry = new Map<FmlRegisteredFieldControls, unknown>();

/**
 * Register a field control's concrete implementation.
 * @param key The string key of the registered field control
 * @param impl The field control's implementation
 */
export function registerFieldControl(
  key: FmlRegisteredFieldControls,
  impl: unknown,
): void {
  controlRegistry.set(key, impl);
}

/**
 * Gets the field control's implementation from the registry.
 * @param key The string key of the registered field control
 * @returns The implmementation of the field control
 */
export function getFieldControl(
  key: FmlRegisteredFieldControls,
): unknown {
  return controlRegistry.get(key);
}

//#endregion fields

//#region models

export interface FmlModelConfiguration<Value>
  extends FmlControlConfigurationBase<Value> {
  schema: { [Key in keyof Value]: FmlConfiguration<Value[Key]> };
}

//#endregion

//#region lists

export interface FmlListConfiguration<Value>
  extends FmlControlConfigurationBase<Value[]> {
  itemConfig: FmlConfiguration<Value>;
}

//#endregion

//#endregion

/**
 * A function that can determine the validity of the provided @argument value
 */
export interface FmlValidator<Value> {
  (value: Value): boolean | Promise<boolean>;
}

/**
 * Types that a control validator may return. Multiple validators may be bound
 * to a single control, and when a validator fails, the control should return
 * the configured message for the failed validator.
 */
export type FmlControlValidatorReturnTypes =
  | string
  | string[]
  | undefined
  | void
  | Promise<string | string[] | undefined | void>;

/**
 * A function to be bound to a control that can delegate to a validator. If the
 * validator fails, the control validator should return the corresponding
 * message as configured by the
 *
 * @see {FmlValidatorConfigurationBase}
 */
export interface FmlControlValidator<Value> {
  (value: Value): FmlControlValidatorReturnTypes;
}

/**
 * A function that binds parameters to a validation function so the validator
 * can be invoked with just the form value to be validated.
 */
export interface FmlValidatorFactory<
  Value = unknown,
  Args extends ReadonlyArray<unknown> = [],
> {
  (...params: Args): FmlValidator<Value>;
}

/**
 * Contains all registered validator factories.
 */
export interface FmlValidatorFactoryRegistry {
  readonly [more: string]: FmlValidatorFactory<never, never>;
}

/**
 * Returns all registered validators and their respective factories.
 */
export type FmlRegisteredValidators = {
  [K in KnownKeys<FmlValidatorFactoryRegistry>]: FmlValidatorFactoryRegistry[K];
};

/**
 * Returns all registered validator factories that can be applied to the
 * provided data type.
 */
export type FmlValidators<Value> = {
  [Key in keyof FmlRegisteredValidators as FmlRegisteredValidators[Key] extends FmlValidatorFactory<
    infer ValidatorValue,
    never
  >
  ? //TODO: does it make sense to have bidi extends clauses here?
  ValidatorValue extends Value
  ? Key
  : Value extends ValidatorValue
  ? Key
  : never
  : never]: FmlRegisteredValidators[Key];
};

/**
 * Returns the names of all registered validator factories that can be
 * applied to the provided data type.
 */
export type FmlValidatorKeys<Value> = keyof FmlValidators<Value>;

export type FmlConfiguration<Value> = FmlControlConfiguration<Value>;


export function instantiateValidator<Value>(
  config: FmlValidatorConfiguration<Value>,
): FmlControlValidator<Value> {
  // get the appropriate validator factory for this data type
  const type = config[0];
  const factory = getValidatorFactory(type);

  const args = (config as unknown[]).slice(1, (config as unknown[]).length - 1);

  // create the validator function by applying the factory
  const func = (factory as (...x: unknown[]) => unknown)(
    ...args,
  ) as FmlValidator<Value>;

  const invalidMessage = (config as unknown[]).slice(-1)[0] as string;

  // result is an async function that calls the validator above (which may be async itself) with the current value
  return async function (value: Value) {
    const valid = await func(value);

    if (!valid) {
      return invalidMessage;
    }
    return;
  };
}

/**
 * A means of getting the validator factory registered at the provided name
 * @param name The name of the validator factory to retrieve
 * @returns The validator factory
 */
export function getValidatorFactory<Validator extends keyof FmlRegisteredValidators>(
  name: Validator,
): FmlValidatorFactoryRegistry[Validator] {
  return validatorRegistry[name];
}

/**
 * The actual registry. Don't mess with it.
 */
const validatorRegistry = {} as FmlValidatorFactoryRegistry;

/**
 * Registers the provided validator factory implementation at the provided name.
 * @param name The name of the validator to enter into the registry
 * @param factory The validator factory implementation
 */
export function registerValidator<
  ValidatorKey extends keyof FmlValidatorFactoryRegistry,
>(key: ValidatorKey, factory: FmlValidatorFactoryRegistry[ValidatorKey]): void {
  validatorRegistry[key] = factory;
}

//#region FormState

interface FormNodeStateBase {
  label: string
  isDirty: boolean,
  isTouched: boolean,
  isValid: boolean,
  validationMessages: string[],
  validity: FmlValidityStatus,
}

interface FieldFormState<Value> extends FormNodeStateBase {
  control: FmlRegisteredFieldControls & FmlFieldControlsFor<Value>
}

interface ModelFormState<Value> extends FormNodeStateBase {
  schema: {
    [K in keyof Value]: FormNodeState<Value[K]>
  }
}

interface ListFormState<Value> extends FormNodeStateBase {
  items: FormNodeState<Value>[]
}

export type FormNodeState<Value> = FormNodeStateBase & (
  FmlControlClassification<Value> extends 'model' ? ModelFormState<Value>
  : FmlControlClassification<Value> extends 'list' ? ListFormState<Value>
  : FieldFormState<Value>)


interface FieldFormBindings<Value> {
  setValue(value: Value): void
  onFocus(): void
  onBlur(): void
}

interface ModelFormBindings<Value> {
  schema: {
    [K in keyof Value]: FormNodeBindings<Value[K]>
  }
}

interface ListFormBindings<Value> {
  addItem(): void,
  removeItem(index: number): void
  keyOf(index: number): string
  items: FormNodeBindings<Value>[]
}

export type FormNodeBindings<Value> = (
  FmlControlClassification<Value> extends 'model' ? ModelFormBindings<Value>
  : FmlControlClassification<Value> extends 'list' ? ListFormBindings<Value>
  : FieldFormBindings<Value>)

interface FmlFormStateChangeInfo<Value> {
  value: Value
  validity: FmlValidityStatus
  validationMessages: string[]
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
}

interface FmlFormStateChangeHandler<Value> {
  (change: FmlFormStateChangeInfo<Value>): void
}

export interface FmlFormState<Value, State = FormNodeState<Value>, Bindings = FormNodeBindings<Value>> {
  value: Value,
  state: State
  bindings: Bindings
}

export type FmlFormStateClassification<Value, Classification extends FmlControlClassifications> =
  Classification extends 'field' ? FmlFormState<Value, FieldFormState<Value>, FieldFormBindings<Value>>
  : Classification extends 'model' ? FmlFormState<Value, ModelFormState<Value>, ModelFormBindings<Value>>
  : FmlFormState<Value[], ListFormState<Value>, ListFormBindings<Value>>

export function createStateFromConfig<Value>(
  config: FmlConfiguration<Value>,
  onChange: FmlFormStateChangeHandler<Value>
): FmlFormState<Value> {
  if (isModelConfig(config)) {
    return createModelStateFromConfig(config as FmlConfiguration<object>, onChange as never) as unknown as FmlFormState<Value>
  }
  if (isListConfig(config)) {
    return createListStateFromConfig(config, onChange as never) as unknown as FmlFormState<Value>
  }
  if (isFieldConfig(config)) {
    return createFieldStateFromConfig(config, onChange as never) as unknown as FmlFormState<Value>
  }

  throw new Error('unsupported configuration')
}

export function isFieldState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'field'>): state is FmlFormStateClassification<Value, 'field'> {
  return Boolean((state as FmlFormStateClassification<Value, 'field'>).state.control)
}

export function isModelState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'model'>): state is FmlFormStateClassification<Value, 'model'> {
  return Boolean((state as FmlFormStateClassification<Value, 'model'>).state.schema)
}

export function isListState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'list'>): state is FmlFormStateClassification<Value, 'list'> {
  return Boolean((state as FmlFormStateClassification<Value, 'list'>).state.items)
}

//#endregion

//#region ModelState

function createModelStateFromConfig<Value extends object>(config: FmlModelConfiguration<Value>,
  handleChange: FmlFormStateChangeHandler<Value>
): FmlFormState<Value> {
  const value: Value = {} as Value
  const valueState = {} as { [K in keyof Value]: FormNodeState<Value[K]> }
  const valueBindings = {} as { [K in keyof Value]: FormNodeBindings<Value[K]> }

  for (const key of Object.keys(config.schema)) {
    type Property = keyof Value
    const property = key as Property
    const propertyState = createStateFromConfig(config.schema[property] as FmlConfiguration<Value[Property]>, setPropertyValueInternal(property))

    value[property] = propertyState.value
    valueState[property] = propertyState.state
    valueBindings[property] = propertyState.bindings
  }

  let isDirty = false
  let isTouched = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]> | null

  const validators = (config.validators || []).map(instantiateValidator)
  const hasValidators = Boolean(validators.length)

  function shouldValidate() {
    // we only need to validate if every property is also valid
    return Object.values(valueState).every((state) => (state as FormNodeStateBase).isValid)
  }

  function currentValidityStatus(): FmlValidityStatus {
    if (!hasValidators && !shouldValidate()) {
      return 'valid'
    }

    if (!isTouched) {
      return 'unknown'
    }

    if (isValidating) {
      return 'pending'
    }

    if (validationMessages.length) {
      return 'invalid'
    }

    return 'valid'
  }

  function isCurrentlyValid() {
    return currentValidityStatus() === 'valid'
  }

  function setPropertyValueInternal<Property extends keyof Value>(property: Property) {
    return function (change: FmlFormStateChangeInfo<Value[Property]>) {
      const { value: newValue, ...changeState } = change
      value[property] = newValue

      valueState[property] = {
        ...valueState[property],
        ...changeState
      }

      isDirty = isDirty || Object.values(valueState).some(state => (state as FormNodeState<Value[Property]>).isDirty);
      isTouched = true;

      notifyAndValidate()
    }
  }

  async function notifyAndValidate() {
    isValidating = hasValidators && shouldValidate()
    currentValidationPromise = null
    validationMessages = []

    notifyChange()

    if (!isValidating) {
      return
    }

    const validationPromises = validators.map(validator => validator(value))

    currentValidationPromise = Promise.all(validationPromises)

    const thisValidationPromise = currentValidationPromise

    const results = await thisValidationPromise

    // if another validation was kicked off while this one was running, bail
    if (thisValidationPromise !== currentValidationPromise) {
      return
    }

    validationMessages = results.filter(Boolean).flat() as string[]

    isValidating = false

    currentValidationPromise = null

    notifyChange()
  }

  function notifyChange() {
    handleChange({
      value,
      validationMessages,
      validity: currentValidityStatus(),
      isValid: isCurrentlyValid(),
      isDirty,
      isTouched,
    })
  }

  const state: FormNodeState<object> = {
    label: config.label,
    isDirty,
    isTouched,
    isValid: isCurrentlyValid(),
    validationMessages,
    validity: currentValidityStatus(),
    schema: valueState
  }

  const bindings: FormNodeBindings<object> = {
    schema: valueBindings
  }

  return {
    value,
    state: state as unknown as FmlFormState<Value>['state'],
    bindings: bindings as unknown as FmlFormState<Value>['bindings']
  }
}

function isModelConfig<Value>(config: FmlConfiguration<Value> | FmlModelConfiguration<Value>): config is FmlModelConfiguration<Value> {
  return Boolean((config as FmlModelConfiguration<Value>).schema);
}

//#endregion

//#region ListState

function createListStateFromConfig<Value>(
  config: FmlListConfiguration<Value>,
  handleChange: FmlFormStateChangeHandler<Value[]>
): FmlFormState<Value[]> {
  let currentListItemId = 0
  const itemIds: number[] = []
  const value: Value[] = (config.defaultValue || [])
  const items: FmlFormState<Value>[] = []
  const itemStates: FormNodeState<Value>[] = []
  const itemBindings: FormNodeBindings<Value>[] = []

  value.forEach(instantiateItemState)

  function instantiateItemState(item: Value) {
    const itemConfig = {
      ...config.itemConfig
    }
    itemConfig.defaultValue = item

    const result = createStateFromConfig(itemConfig, change => {
      const idx = items.findIndex(state => state === result)

      // this state was removed from the collection before this update
      if (idx === -1) {
        return
      }
      updateItemInternal(idx, change)
    })

    items.push(result)
    itemStates.push(result.state)
    itemBindings.push(result.bindings)
    itemIds.push(currentListItemId++)

    return result
  }

  let isDirty = false
  let isTouched = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]> | null

  const validators = (config.validators || []).map(instantiateValidator)
  const hasValidators = Boolean(validators.length)

  function shouldValidate() {
    // we only need to validate the list if all the items are also valid
    return !value.length || itemStates.every(state => state.isValid)
  }

  function currentValidityStatus(): FmlValidityStatus {
    if (!hasValidators && !shouldValidate()) {
      return 'valid'
    }

    if (!isTouched) {
      return 'unknown'
    }

    if (isValidating) {
      return 'pending'
    }

    if (validationMessages.length) {
      return 'invalid'
    }

    const validities = new Set<FmlValidityStatus>(
      items.map(state => state.state.validity)
    );

    return validities.has('invalid')
      ? 'invalid'
      : validities.has('unknown') || validities.has('pending')
        ? 'unknown'
        : 'valid'
  }

  function isCurrentlyValid() {
    return currentValidityStatus() === 'valid'
  }

  function addItem() {
    const newValue = sensibleDefaultValueForItem() as Value
    value.push(newValue)
    instantiateItemState(newValue)

    isDirty = true;
    isTouched = true;

    notifyAndValidate()
  }

  function removeItem(index: number) {
    value.splice(index, 1)
    items.splice(index, 1)
    itemIds.splice(index, 1)
    itemStates.splice(index, 1)
    itemBindings.splice(index, 1)

    isDirty = isDirty || itemStates.some(state => state.isDirty);
    isTouched = true;

    notifyAndValidate()
  }

  function updateItemInternal(index: number, change: FmlFormStateChangeInfo<Value>) {
    const { value: newValue, ...changeState } = change
    value.splice(index, 1, newValue)
    itemStates[index] = {
      ...itemStates[index],
      ...changeState
    }


    isDirty = isDirty || itemStates.some(state => state.isDirty);
    isTouched = true;

    notifyAndValidate()
  }

  async function notifyAndValidate() {
    isValidating = hasValidators && shouldValidate()
    currentValidationPromise = null
    validationMessages = []

    notifyChange()

    if (!isValidating) {
      return
    }

    const validationPromises = validators.map(validator => validator(value))

    currentValidationPromise = Promise.all(validationPromises)

    const thisValidationPromise = currentValidationPromise

    const results = await thisValidationPromise

    // if another validation was kicked off while this one was running, bail
    if (thisValidationPromise !== currentValidationPromise) {
      return
    }

    validationMessages = results.filter(Boolean).flat() as string[]

    isValidating = false

    currentValidationPromise = null

    notifyChange()
  }

  function keyOf(index: number): string {
    return itemIds[index].toString()
  }

  function notifyChange() {
    handleChange({
      value,
      validationMessages,
      validity: currentValidityStatus(),
      isValid: isCurrentlyValid(),
      isDirty,
      isTouched,
    })
  }

  function sensibleDefaultValueForItem() {
    if (isModelConfig(config.itemConfig)) {
      return {
        ...config.itemConfig.defaultValue || {}
      }
    }
    if (isListConfig(config.itemConfig)) {
      return [...(config.itemConfig.defaultValue || [])]
    }
    return config.itemConfig.defaultValue
  }

  const state: FmlFormStateClassification<Value, 'list'>['state'] = {
    label: config.label,
    isDirty,
    isTouched,
    isValid: isCurrentlyValid(),
    validationMessages,
    validity: currentValidityStatus(),
    items: itemStates
  }

  const bindings: FmlFormStateClassification<Value, 'list'>['bindings'] = {
    addItem,
    removeItem,
    items: itemBindings,
    keyOf
  }

  return {
    value,
    state,
    bindings,
  } as FmlFormState<Value[]>
}

function isListConfig<Value>(config: FmlConfiguration<Value> | FmlListConfiguration<Value>): config is FmlListConfiguration<Value> {
  return Boolean((config as FmlListConfiguration<Value>).itemConfig);
}

//#endregion

//#region FieldState

function createFieldStateFromConfig<Value extends FmlFieldValueTypes>(
  config: FmlFieldConfigurationBase<Value>,
  handleChange: FmlFormStateChangeHandler<Value>
): FmlFormState<Value> {
  let value: Value = config.defaultValue
  let isDirty = false
  let isTouched = false
  let hasBlurred = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]> | null

  const validators = (config.validators || []).map(instantiateValidator)
  const hasValidators = Boolean(validators.length)

  function currentValidityStatus(): FmlValidityStatus {
    if (!hasValidators) {
      return 'valid'
    }

    if (!isTouched) {
      return 'unknown'
    }

    if (isValidating) {
      return 'pending'
    }

    if (validationMessages.length) {
      return 'invalid'
    }

    return 'valid'
  }

  function isCurrentlyValid() {
    return currentValidityStatus() === 'valid'
  }

  function setValue(newValue: Value) {
    // no need to notify change if setting to the same value...
    if (value === newValue) {
      return;
    }

    isDirty = true
    isTouched = true
    value = newValue

    notifyAndValidate()
  }

  async function notifyAndValidate() {
    isValidating = hasValidators

    currentValidationPromise = null

    notifyChange()

    if (!hasValidators) {
      return;
    }

    const validationPromises = validators.map(validator => validator(value))

    currentValidationPromise = Promise.all(validationPromises)

    const thisValidationPromise = currentValidationPromise

    const results = await thisValidationPromise

    // if another validation was kicked off while this one was running, bail
    if (thisValidationPromise !== currentValidationPromise) {
      return
    }

    validationMessages = results.filter(Boolean).flat() as string[]

    isValidating = false

    currentValidationPromise = null

    notifyChange()
  }

  function onBlur() {
    const isFirstBlur = hasBlurred === false

    // no need to notify of this change
    hasBlurred = true

    // iff it's the first time interacting with the field, validate the initial value
    // otherwise, let the change handler handle changes :)
    if (!isDirty && isFirstBlur && hasValidators) {
      notifyAndValidate()
    }
  }

  function onFocus() {
    const changing = isTouched === false

    isTouched = true

    if (changing) {
      notifyChange()
    }
  }

  function notifyChange() {
    handleChange({
      value,
      validationMessages,
      validity: currentValidityStatus(),
      isValid: isCurrentlyValid(),
      isDirty,
      isTouched,
    })
  }

  const state: FmlFormState<FmlFieldValueTypes>['state'] = {
    label: config.label,
    control: config.control,
    isDirty,
    isTouched,
    isValid: isCurrentlyValid(),
    validationMessages,
    validity: currentValidityStatus(),
  };

  const bindings: FmlFormState<FmlFieldValueTypes>['bindings'] = {
    setValue,
    onBlur,
    onFocus
  }

  return {
    value,
    state: state as unknown as FmlFormState<Value>['state'],
    bindings: bindings as unknown as FmlFormState<Value>['bindings']
  }
}

function isFieldConfig<Value>(config: FmlConfiguration<Value> | FmlFieldConfiguration<Value>): config is FmlFieldConfiguration<Value> {
  return Boolean((config as unknown as FmlFieldConfigurationBase<Value>).control);
}

//#endregion
