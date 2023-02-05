import { FmlConfiguration, FmlControlValidatorReturnTypes, FmlFieldConfiguration, FmlFieldConfigurationBase, FmlValidityStatus } from '../index';
import { FmlFormStateChangeHandler } from './FormState';
import { instantiateValidator } from './Validators';

export interface FieldStateApi<Value> {
  fmlType: 'field'
  initialValue: Value | undefined
  initialValidity: FmlValidityStatus
  setValue: (value: Value) => void
  onFocus: () => void
  onBlur: () => void
}

export function createFieldStateFromConfig<Value>(
  config: FmlFieldConfigurationBase<Value>,
  handleChange: FmlFormStateChangeHandler<Value>
): FieldStateApi<Value> {
  let value: Value = config.defaultValue
  let isDirty = false
  let isTouched = false
  let hasBlurred = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]>

  const validators = (config.validators || []).map(instantiateValidator)
  const shouldValidate = Boolean(validators.length)

  function currentValidityStatus(): FmlValidityStatus {
    if (!shouldValidate) {
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

    validateCurrentValue(() => {
      isDirty = true
      value = newValue
    })
  }

  async function validateCurrentValue(preMutation: () => void = () => { }) {
    preMutation()

    isValidating = shouldValidate

    notifyChange()

    if (!shouldValidate) {
      return;
    }

    const validationPromises = validators.map(validator => validator(value!))

    currentValidationPromise = Promise.all(validationPromises)

    const thisValidationPromise = currentValidationPromise

    const results = await thisValidationPromise

    // if another validation was kicked off while this one was running, bail
    if (thisValidationPromise !== currentValidationPromise) {
      return
    }

    validationMessages = results.filter(Boolean).flat() as string[]

    isValidating = false

    notifyChange()
  }

  function onBlur() {
    debugger;
    const isFirstBlur = hasBlurred === false

    // no need to notify of this change
    hasBlurred = true

    // iff it's the first time interacting with the field, validate the initial value
    // otherwise, let the change handler handle changes :)
    if (!isDirty && isFirstBlur && shouldValidate) {
      validateCurrentValue()
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
    // todo: shallow compare to reduce unnecessary notifications

    handleChange({
      value: value!,
      validationMessages,
      validity: currentValidityStatus(),
      isValid: isCurrentlyValid(),
      isDirty,
      isTouched,
    })
  }

  return {
    fmlType: 'field',
    initialValue: value,
    initialValidity: currentValidityStatus(),
    setValue,
    onBlur,
    onFocus,
  }
}

export function isFieldConfig<Value>(config: FmlConfiguration<Value> | FmlFieldConfiguration<Value>): config is FmlFieldConfiguration<Value> {
  return Boolean((config as unknown as FmlFieldConfigurationBase<Value>).control);
}
