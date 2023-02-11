import { instantiateValidator, FmlFieldValueTypes, FmlConfiguration, FmlControlValidatorReturnTypes, FmlFieldConfiguration, FmlFieldConfigurationBase, FmlValidityStatus } from '../index';
import { FmlFormState, FmlFormStateChangeHandler } from './FormState';

export function createFieldStateFromConfig<Value extends FmlFieldValueTypes>(
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

export function isFieldConfig<Value>(config: FmlConfiguration<Value> | FmlFieldConfiguration<Value>): config is FmlFieldConfiguration<Value> {
  return Boolean((config as unknown as FmlFieldConfigurationBase<Value>).control);
}
