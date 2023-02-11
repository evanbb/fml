import { instantiateValidator, FmlConfiguration, FmlControlValidatorReturnTypes, FmlModelConfiguration, FmlValidityStatus } from '../index';
import { createStateFromConfig, FmlFormState, FmlFormStateChangeHandler, FmlFormStateChangeInfo, FormNodeBindings, FormNodeState, FormNodeStateBase } from './FormState';

export function createModelStateFromConfig<Value extends object>(config: FmlModelConfiguration<Value>,
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

export function isModelConfig<Value>(config: FmlConfiguration<Value> | FmlModelConfiguration<Value>): config is FmlModelConfiguration<Value> {
  return Boolean((config as FmlModelConfiguration<Value>).schema);
}
