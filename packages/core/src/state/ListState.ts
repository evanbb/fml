import { instantiateValidator, FmlConfiguration, FmlControlValidatorReturnTypes, FmlListConfiguration, FmlValidityStatus } from '../index';
import { createStateFromConfig, FmlFormState, FormNodeState, FmlFormStateChangeHandler, FormNodeBindings, FmlFormStateChangeInfo, FmlFormStateClassification } from './FormState';
import { isModelConfig } from './ModelState';

export function createListStateFromConfig<Value>(
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
    instantiateItemState(newValue)

    isDirty = true;
    isTouched = true;

    notifyAndValidate()
  }

  function removeItem(index: number) {
    value.splice(index, 1)
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

export function isListConfig<Value>(config: FmlConfiguration<Value> | FmlListConfiguration<Value>): config is FmlListConfiguration<Value> {
  return Boolean((config as FmlListConfiguration<Value>).itemConfig);
}
